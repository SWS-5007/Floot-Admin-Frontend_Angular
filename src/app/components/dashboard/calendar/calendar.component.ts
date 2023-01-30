import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  ViewEncapsulation,
  OnInit,
} from "@angular/core";
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from "date-fns";
import { Subject } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarDateFormatter
} from "angular-calendar";
import { EventColor } from "calendar-utils";
import { CalendarService } from "../../../services/calendar/calendar.service";
import { CustomDateFormatter } from './ custom-date-formatter.provider';

const colors: Record<string, EventColor> = {
  red: {
    primary: "#ad2121",
    secondary: "#FAE3E3",
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF",
  },
  yellow: {
    primary: "#e3bc08",
    secondary: "#FDF1BA",
  },
};

@Component({
  selector: "app-calendar",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./calendar.component.less"],
  templateUrl: "./calendar.component.html",
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class CalendarComponent implements OnInit {
  @ViewChild("modalContent", { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  venue_id: number = 1;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: "Edit",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        console.log("inside edit event");
        this.handleEvent("Edited", event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: "Delete",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        console.log("inside deleteEvent");
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent("Deleted", event);
      },
    },
  ];

  refresh = new Subject<void>();

  firstThreeEvents: CalendarEvent[] = [];

  events: CalendarEvent[] = [
    // {
    //   start: subDays(startOfDay(new Date()), 1),
    //   end: addDays(new Date(), 1),
    //   title: 'A 3 day event',
    //   color: { ...colors["red"] },
    //   actions: this.actions,
    //   allDay: true,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true,
    //   },
    //   draggable: true,
    // },
    // {
    //   start: startOfDay(new Date()),
    //   title: 'An event with no end date',
    //   color: { ...colors["yellow"] },
    //   actions: this.actions,
    // },
    // {
    //   start: subDays(endOfMonth(new Date()), 3),
    //   end: addDays(endOfMonth(new Date()), 3),
    //   title: 'A long event that spans 2 months',
    //   color: { ...colors["blue"] },
    //   allDay: true,
    // },
    // {
    //   start: addHours(startOfDay(new Date()), 2),
    //   end: addHours(new Date(), 2),
    //   title: 'A draggable and resizable event',
    //   color: { ...colors["yellow"] },
    //   actions: this.actions,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true,
    //   },
    //   draggable: true,
    // },
  ];

  activeDayIsOpen: boolean = false;

  constructor(
    private modal: NgbModal,
    private CalendarService: CalendarService
  ) {}

  ngOnInit(): void {
    this.getEvents();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent("Dropped or resized", event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log("inside handleEvent");
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: "lg" });
  }

  addEvent(): void {
    console.log("inside add event");

    const eventToCreate = {
      id: null,
      title: "New event",
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors["red"],
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
    };
    const newEventId = this.createEvent(eventToCreate);
    eventToCreate.id = newEventId;
    this.events = [...this.events, eventToCreate];
  }

  public async deleteEvent(eventToDelete: CalendarEvent) {
    console.log("inside delete event");
    this.events = this.events.filter((event) => event !== eventToDelete);
    await this.CalendarService.deleteCalendarEvent(
      eventToDelete,
      this.venue_id
    );
  }

  public async createEvent(eventToCreate: CalendarEvent) {
    console.table(eventToCreate);
    console.log("inside save event");
    const results = await this.CalendarService.createCalendarEvent(
      eventToCreate,
      this.venue_id
    );
    console.log("this.events", this.events);
    return results;
  }

  public async updateEvent(eventToUpdate: CalendarEvent) {
    console.table(eventToUpdate);
    console.log("inside update event");
    console.log(this.events);
    await this.CalendarService.updateCalendarEvent(
      eventToUpdate,
      this.venue_id
    );
  }

  getOrdinalNum(number) {
    let selector;
  
    if (number <= 0) {
      selector = 4;
    } else if ((number > 3 && number < 21) || number % 10 > 3) {
      selector = 0;
    } else {
      selector = number % 10;
    }
  
    return number + ['th', 'st', 'nd', 'rd', ''][selector];
  };

  public async getEvents() {
    console.log("inside update event");
    const results = await this.CalendarService.getCalendarEvents(this.venue_id);
    console.log("raw results is: " , results)
    const formatedResults = (results ?? []).map((event) => {
      event.start = startOfDay(new Date(event.start));
      event.end = endOfDay(new Date(event.end));
      return event;
    });
    console.log("formatedResults", formatedResults);
    const newFormatedResults = formatedResults.map( (event) => {
      let month = event.start.toLocaleDateString('en-gb', { month: 'long' } )
      let day = event.start.toLocaleDateString('en-gb', { day: 'numeric'} )
      event.startDay = `${this.getOrdinalNum(day)} ${month}`
      return event
    })
    this.events = formatedResults;
    this.firstThreeEvents = newFormatedResults.slice(0, 3);
    this.refresh.next();
  }

  setView(view: CalendarView) {
    console.log("inside set view");
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
