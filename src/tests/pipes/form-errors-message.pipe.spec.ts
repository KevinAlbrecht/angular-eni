import { FormErrorsMessagePipe } from '~shared/ui/form-errors-message.pipe';

describe('FormErrorsMessagePipe', () => {
  let pipe: FormErrorsMessagePipe;

  beforeEach(() => {
    pipe = new FormErrorsMessagePipe();
  });

  it('should return null if errors is null', () => {
    const result = pipe.transform(null, {});
    expect(result).toBeNull();
  });

  it('should return the error messages separated by commas', () => {
    const errors = { required: true, minlength: true };
    const map = {
      required: 'Field is required',
      minlength: 'Minimum length is 5',
    };
    const result = pipe.transform(errors, map);
    expect(result).toBe('Field is required, Minimum length is 5');
  });

  it('should return an empty string if no matching message is found in the map', () => {
    const errors = { required: true };
    const map = { minlength: 'Minimum length is 5' };
    const result = pipe.transform(errors, map);
    expect(result).toBe('');
  });
});
