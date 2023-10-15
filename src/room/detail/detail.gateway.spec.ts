import { Test, TestingModule } from '@nestjs/testing';
import { DetailGateway } from './detail.gateway';

describe('DetailGateway', () => {
  let gateway: DetailGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetailGateway],
    }).compile();

    gateway = module.get<DetailGateway>(DetailGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
