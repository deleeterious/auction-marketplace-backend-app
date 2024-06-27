import { Test, TestingModule } from '@nestjs/testing';
import { PasswordRecoveryController } from './password-recovery.controller';

describe('PasswordRecoveryController', () => {
  let controller: PasswordRecoveryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordRecoveryController],
    }).compile();

    controller = module.get<PasswordRecoveryController>(PasswordRecoveryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
