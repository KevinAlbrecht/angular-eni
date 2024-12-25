import { Component, input } from '@angular/core';
import { Ticket } from '../models';
import { TitleLimiterPipe } from './title-limiter.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [TitleLimiterPipe, RouterLink],
  template: `
    <a [routerLink]="['/ticket/', ticket().id]" draggable="false">
      <div id="wrapper" [class]="ticket().type">
        <h4>
          {{ ticket().title | titleLimiter }}
        </h4>
        <span>{{ ticket().assignee || 'unassigned' }}</span>
      </div>
    </a>
  `,
  styles: `
    #wrapper {
      width: 200px;
      border-radius: 5px;
      min-height: 50px;
      max-height: 100px;
      border: 1px solid #555;
      box-shadow: 0px 0px 3px black;
      padding: 10px;
      overflow: hidden;
      position: relative;
      cursor: pointer;
      background-color: white;

      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 5px;
        height: 100%;
      }

      &.feature:before {
        background-color: blue;
      }
      &.bug:before {
        background-color: red;
      }
      &.task:before {
        background-color: green;
      }

      h4 {
        font-size: 16px;
        margin: 0;
        margin-bottom: 15px;
      }

      span {
        font-size: 12px;
      }
    }
  `,
})
export class CardComponent {
  ticket = input.required<Ticket>();
}
