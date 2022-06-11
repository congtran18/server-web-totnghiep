import { Injectable } from '@nestjs/common';
import { Connection, Model, FilterQuery } from "mongoose";
import { User } from "./schemas/user.schema";
import { Admin } from "../admins/schemas/admin.schema";
import { ROLE_USER, ROLE_TUTOR } from "../../collections/admins/dto/admin.roles";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FullUserDto } from "./dto/full-user.dto";
import moment from "moment";
import { AppUtil } from "../../utils/app.util";
import { CreateUserDto } from "./dto/create-user.dto";

const defaultProjection = { '_id': 0, '__v': 0, 'password': 0 };

@Injectable()
export class UsersService {

  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
  ) {
  }

  async isEmpty(): Promise<boolean> {
    return (await this.userModel.estimatedDocumentCount().exec()) == 0;
  }

  // Search users
  // Input: username
  // If input is undefined, return all
  async getUsers(page?: string, limit?: string, email?: string, role?: string, sort?: string, track?: string): Promise<any> {
    // const MAX_ITEMS_PAGING = 50;
    // const from = Math.abs(fromIndex ?? 0);
    // const to = Math.abs(toIndex ?? MAX_ITEMS_PAGING);
    // const skip = Math.min(from, to);
    // const limit = Math.min(MAX_ITEMS_PAGING, Math.abs(to - from));
    let pageNumber = 1;
    let limitNumber = 100;

    var userSort = {}
    userSort = { ...userSort, 'createdAt': -1 }

    if (page) {
      pageNumber = parseInt(page);
    }

    if (limit) {
      limitNumber = parseInt(limit);
    }

    if (sort) {
      if (sort === "old") {
        userSort = { ...userSort, 'createdAt': 1 }
      }
    }

    const result = await this.userModel.aggregate([
      {
        $lookup: {
          from: "admins",
          localField: "uid",
          foreignField: "uid",
          as: "role_user"
        }
      },
      {
        $match: {
          $and: [
            email ? { 'email': new RegExp('^' + email, 'i') } : {},
            role ? { "role_user.role": role } : {},
            track ? { "track": JSON.parse(track.toLowerCase()) } : {}
            // { 'isMobileVerified': false}
          ]
        }
      },
      { $sort: { ...userSort } },
      {
        $facet: {
          'role_user':
            [
              { $unwind: '$role_user' },
              { $skip: (pageNumber - 1) * limitNumber },
              { $limit: limitNumber },
            ],
          'count':
            [
              { $count: "totalCount" },
            ],
        }
      }
    ])
    return result;
  }

  // Get users in a uid list
  async getAllInList(uids: string[]): Promise<User[]> {
    return this.userModel.find({ uid: { '$in': uids } }, defaultProjection).exec();
  }

  // Get user information by uid
  async getUserByUid(uid: string | any): Promise<User | null> {
    return await this.userModel.findOne({ uid: uid }, defaultProjection).exec();
  }

  // Get user information by username
  // Return full user object with password to verify
  async getUserByEmailRaw(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email: email }).exec();
  }

  // Get user information by username
  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email: email }, defaultProjection).exec();
  }

  async updateTimeLeftCoureUser(email: string, daysleft: number): Promise<User | null> {
    return await this.userModel.findOneAndUpdate(
      {
        email: email
      },
      {
        minutes: 30,
        $inc: { daysleft: daysleft }
      },
      {
        new: true,
        useFindAndModify: false,
      },
    );
  }

  async updateUserDayLeft(): Promise<User | null> {
    await this.userModel.updateMany({ daysleft: { $gt: 0 }, track: false }, { $inc: { daysleft: -1 } }, { upsert: false });
    return null
  }

  async updateUserMinutesLeft(uid: string, value: number): Promise<User | null> {
    return await this.userModel.findOneAndUpdate(
      {
        uid: uid
      },
      {
        $inc: { minutes: -value }
      },
      {
        new: true,
        useFindAndModify: false,
      },
    );
  }

  async checkUserMinutesLeft(uid: string): Promise<any> {
    const result = await this.userModel.findOne(
      {
        uid: uid
      },
    );

    return result?.minutes
  }

  async createUser(userDto: CreateUserDto): Promise<User | null> {
    const uid = AppUtil.nanoId();
    const fullUserDto: FullUserDto = {
      ...userDto,
      uid: uid,
      password: await AppUtil.hash(userDto.password)
    }
    const userModel = new this.userModel(fullUserDto);
    const user = await userModel.save();
    if (user) {
      const obj = user.toObject<User>();

      const adminModel = new this.adminModel({ "uid": uid, "role": ROLE_USER })

      await adminModel.save();

      delete obj._id;
      delete obj.__v;
      delete obj.password;
      return obj;
    }
    return null;
  }

  async updateUser(uid: string, userDto: UpdateUserDto): Promise<User | null> {
    if (userDto.password) {
      userDto.password = await AppUtil.hash(userDto.password);

    }
    const fullUserDto: FullUserDto = {
      ...userDto,
      uid: uid
    }
    const res = await this.userModel.updateOne({ uid: uid }, {
      ...fullUserDto,
      updatedAt: moment().toDate(),
    }, { upsert: true });
    if (res) {
      return this.getUserByUid(uid);
    } else {
      return null;
    }
  }

  async updateStatusUser(uid?: string, online?: Boolean): Promise<User | null> {
    return await this.userModel.findOneAndUpdate(
      {
        uid: uid
      },
      {
        online: online,
      },
      {
        new: true,
        useFindAndModify: false,
      },
    );
  }

  async updateCallingUser(uidTo?: string, uidFrom?: string, calling?: Boolean): Promise<any> {
    return await this.userModel.updateMany(
      {
        uid: { $in: [uidTo, uidFrom] }
      },
      {
        calling: calling,
      },
      {
        new: true,
        useFindAndModify: false,
      },
    );
  }

  async findAll() {
    const result = await this.userModel.aggregate([
      {
        $lookup: {
          from: "tutors",
          localField: "uid",
          foreignField: "uid",
          pipeline: [],
          as: "user_tutor"
        }
      },
      // {
      //   $match: {
      //     // $and: [
      //     //   // { "user_tutor.accept": true },
      //     // ]
      //   }
      // },
      { $sort: { 'online': -1 } },
      {
        $facet: {
          'users':
            [
              // { $unwind: '$user_tutor' },
            ],
          'count':
            [
              { $count: "totalCount" },
            ],
        }
      }
    ])
    return result;
  }

  async deleteUser(uid: string): Promise<boolean> {
    const res = await this.userModel.deleteOne({ uid: uid }).exec();
    return (res && res.deletedCount ? res.deletedCount > 0 : false);
  }

}
