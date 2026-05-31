describe('HealthService', () => {
  it('returns liveness', () => {
    expect(service.getLiveness()).toHaveProperty(
      'status',
      'alive',
    );
  });

  it('returns readiness when dependencies are healthy', async () => {
    jest.spyOn(dataSource, 'query').mockResolvedValue([]);

    jest.spyOn(redis, 'ping').mockResolvedValue('PONG');

    const result = await service.getReadiness();

    expect(result.status).toBe('ready');
  });
});