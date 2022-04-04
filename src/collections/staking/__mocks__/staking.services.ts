import { stakingStub } from "../test/stubs/staking.stub";

export const StakingService = jest.fn().mockReturnValue({
  getStakingById: jest.fn().mockResolvedValue(stakingStub()),
  getAllStaking: jest.fn().mockResolvedValue([stakingStub()]),
  createStaking: jest.fn().mockResolvedValue(stakingStub()),
  updateStaking: jest.fn().mockResolvedValue(stakingStub()),
})