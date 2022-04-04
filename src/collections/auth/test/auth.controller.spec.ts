import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from "../auth.service"
import { authStub } from "./stubs/auth.stub";
import { loginStub } from "./stubs/login.stub";
import { LoginDto } from "../dto/login.dto";
import { Injectable, UnauthorizedException } from '@nestjs/common';

jest.mock('../auth.service');

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        jest.clearAllMocks();
    });

    it('it should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('signIn', () => {
        let data: any = {
            user: {
                username: "String",
                fullName: "String",
                uid: "String",
                updatedAt: "2021-12-20T03:41:13.752Z",
                createdAt: "2021-12-20T03:41:13.752Z"
            },
            accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2RE5wVHMzaUNLdUJqWEFaejhzOEoiLCJ0aWQiOiJJUVEwbU5GbkNwRjZWdUV4NjZzVnkiLCJpYXQiOjE2NDEyOTEzOTAsImV4cCI6MTY0Mzg4MzM5MH0.D2A8OTFCae6WPWD2_W4uSw-EfhZnZl5C0xdyL6IDmqU",
            expiresIn: "30d"
        }
        let expectedResult = loginStub()
        let loginDto: LoginDto;
        let req;

        loginDto = {
            username: loginStub().username,
            password: loginStub().password
        }

        beforeEach(async () => {
            jest
                .spyOn(authService, 'login')
                .mockResolvedValue(data);


            req = await authController.login(loginDto);
        });

        it('calls authService.signIn()', async () => {
            // await authController.login(loginDto);

            expect(authService.login).toHaveBeenCalledTimes(1);
            expect(authService.login).toHaveBeenCalledWith(loginDto);
        });

        it('when the credentials are valid, returns the created token', async () => {
            const generatedToken: any = {
                  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJaS3lGb3NjZW5RVzdlbTMxQWpnc3kiLCJ0aWQiOiIwLUFPekplN0o5MGZYaWN2Yy1LNG8iLCJpYXQiOjE2NDQyMjU4MDAsImV4cCI6MTY0NjgxNzgwMH0.ZXdauI7RJFV13zspeKv0vuwiixyZjsruU4IN_BJIAA8",
                
              }

            let loginAdmin = {
                username: "admin",
                password: "admin"
            }

            authService.login = jest.fn().mockResolvedValue(generatedToken);

            const result: any = await authController.login(
                loginAdmin,
            );

            expect(result).toEqual(generatedToken);
        });

        it('when authService.signIn() throws an exception, it throws this too', async () => {
            const exception: UnauthorizedException = new UnauthorizedException(
                'Invalid credentials',
            );
            authService.login = jest.fn().mockRejectedValue(exception);

            await expect(authController.login(loginDto)).rejects.toThrow(
                exception,
            );
        });
    });
});

