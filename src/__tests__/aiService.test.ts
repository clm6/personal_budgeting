import { AICategorizer, fallbackRuleBased } from '../aiService';

describe('fallbackRuleBased', () => {
  it('classifies grocery descriptions as Food', () => {
    expect(fallbackRuleBased('Weekly grocery run')).toBe('Food');
  });

  it('defaults to Other for unknown descriptions', () => {
    expect(fallbackRuleBased('mysterious expense')).toBe('Other');
  });
});

describe('AICategorizer.predict', () => {
  it('uses AI model for known merchants', async () => {
    const result = await AICategorizer.predict('Starbucks coffee');
    expect(result.category).toBe('Food');
    expect(result.method).toBe('AI');
  });

  it('falls back to rules when AI is unsure', async () => {
    const description = 'random transaction';
    const result = await AICategorizer.predict(description);
    expect(result.method).toBe('Rules');
    expect(result.category).toBe(fallbackRuleBased(description));
  });
});
