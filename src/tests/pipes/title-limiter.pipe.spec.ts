import { TitleLimiterPipe } from '../../app/board/ui/title-limiter.pipe';

describe('TitleLimiterPipe', () => {
  let pipe: TitleLimiterPipe;

  beforeEach(() => {
    pipe = new TitleLimiterPipe();
  });

  it('should shorten the text if exceeds max length', () => {
    const text = 'Lorem ipsum dolor sit amet, consectetur';
    const defaultLimit = 40;
    const suffix = '...';
    const tests: [string, number | undefined, string][] = [
      [text, 10, text.slice(0, 10) + suffix],
      [text, 100, text],
      [text, undefined, text],
    ];

    tests.forEach(([entry, limit, expectedResult]) => {
      const result = pipe.transform(entry, limit);
      expect(result).toBe(expectedResult);
    });
  });
});
