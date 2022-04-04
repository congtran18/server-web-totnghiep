import { Test } from '@nestjs/testing';
import { UpdateStakingtDto } from '../dto/update-staking.dto';
import { StakingController } from '../staking.controller';
import { StakingService } from '../staking.service';
import { stakingStub } from './stubs/staking.stub';

jest.mock('../staking.service');

describe('StakingController', () => {
  let stakingController: StakingController;
  let stakingService: StakingService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      // imports: [],
      controllers: [StakingController],
      providers: [StakingService],
    }).compile();

    stakingController = moduleRef.get<StakingController>(StakingController);
    stakingService = moduleRef.get<StakingService>(StakingService);
    jest.clearAllMocks();
  });

  it('it should be defined', () => {
    expect(stakingController).toBeDefined();
  });

  describe('try get Staking By Id', () => {
    it('should return an Staking if successful', async () => {
      const expectedResult = stakingStub();
      const mockNumberToSatisfyParameters = stakingStub()._id;

      jest
        .spyOn(stakingService, 'getStakingById')
        .mockResolvedValue(expectedResult);

      expect(
        (await stakingController.getStakingById(mockNumberToSatisfyParameters))
          .data,
      ).toEqual(expectedResult);
    });
  });

  describe('try get All Staking', () => {
    it('should return an array of Staking if successful', async () => {
      const expectedResult = Array(5).fill(stakingStub());
      // const mockNumberToSatisfyParameters = stakingStub()._id;

      jest
        .spyOn(stakingService, 'getAllStaking')
        .mockResolvedValue(expectedResult);

      expect((await stakingController.getAllStaking('1', '5')).data).toEqual(
        expectedResult,
      );
    });
  });

  describe('try to Create a Staking', () => {
    it('should create a staking if successful', async () => {
      const expectedResult = stakingStub();

      jest
        .spyOn(stakingService, 'createStaking')
        .mockResolvedValue(expectedResult);

      expect((await stakingController.createStaking(stakingStub())).data).toEqual(
        expectedResult,
      );
    });
  });

  describe('try to Update a Staking', () => {
    it('should update a staking if successful', async () => {
      const expectedResult: UpdateStakingtDto = stakingStub();

      jest
        .spyOn(stakingService, 'updateStaking')
        .mockResolvedValue(expectedResult);

      expect((await stakingController.updateStaking(stakingStub())).data).toEqual(
        expectedResult,
      );
    });
  });

  describe('try to delete a Staking By Id', () => {
    it('should delete an Staking if successful', async () => {
      const expectedResult = stakingStub();
      const mockNumberToSatisfyParameters = stakingStub()._id;

      jest
        .spyOn(stakingService, 'deleteStaking')
        .mockResolvedValue(expectedResult);

      expect(
        (await stakingController.deleteStaking(mockNumberToSatisfyParameters))
          .data,
      ).toEqual(expectedResult);
    });
  });
});
