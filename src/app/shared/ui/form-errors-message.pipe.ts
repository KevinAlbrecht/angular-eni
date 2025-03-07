import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'formErrorsMessage',
})
export class FormErrorsMessagePipe implements PipeTransform {
  transform(errors: ValidationErrors | null, map: Record<string, string>): string | null {
    if (!errors) return null;

    return Object.entries(errors)
      .map(([key]) => {
        const message = map[key] || '';
        return `${message}`;
      })
      .join(', ');
  }
}
