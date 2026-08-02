import { Test } from '@nestjs/testing';
import { FlightsService } from './flights.service';
import { FlightsRepository } from './flights.repository';
import { AppError } from 'src/shared/errors/app-error';
import { FlightsGateway } from './flights.gateway';

describe('FlightsService', () => {
  let service: FlightsService;
  let repo: {
    findAll: jest.Mock;
    findStats: jest.Mock;
    getById: jest.Mock;
    count: jest.Mock;
  };

  beforeEach(async () => {
    repo = {
      findAll: jest.fn(),
      findStats: jest.fn(),
      getById: jest.fn(),
      count: jest.fn(),
    };
    const module = await Test.createTestingModule({
      providers: [
        FlightsService,
        { provide: FlightsRepository, useValue: repo },
        {
          provide: 'REDIS_CLIENT',
          useValue: { get: jest.fn(), set: jest.fn(), del: jest.fn() },
        },
        {
          provide: FlightsGateway,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<FlightsService>(FlightsService);
  });

  it('returns flights from cache, if available', async () => {
    const cachedFlights = {
      data: [{ id: '1', flightNumber: 'AA123' }],
      total: 1,
      limit: 20,
      offset: 0,
    };

    const redisMock = {
      get: jest
        .fn()
        .mockResolvedValueOnce('1')
        .mockResolvedValueOnce(JSON.stringify(cachedFlights)),
    };

    const module = await Test.createTestingModule({
      providers: [
        FlightsService,
        { provide: FlightsRepository, useValue: repo },
        { provide: 'REDIS_CLIENT', useValue: redisMock },
        {
          provide: FlightsGateway,
          useValue: {},
        },
      ],
    }).compile();

    const cachedService = module.get(FlightsService);
    const result = await cachedService.findAll({});

    expect(result).toEqual(cachedFlights);
    expect(redisMock.get).toHaveBeenNthCalledWith(1, 'flights:cache_version');
    expect(redisMock.get).toHaveBeenNthCalledWith(2, 'flights:v1{}');
    expect(repo.findAll).not.toHaveBeenCalled();
  });

  it('throw AppError if no flight found', async () => {
    repo.getById.mockResolvedValue(null);
    await expect(service.getById('missing-id')).rejects.toThrow(AppError);
  });
});
