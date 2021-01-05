// live-datetime - web component for displaying the a time relative
// to the current time.  Will update itself over time.  If time is in the
// future or more than 24 hours in the past, will only display the specific time.
import { Component, Host, Prop, State, h } from '@stencil/core';
import moment, { Moment } from 'moment';


const CurrentYearDateFormat = 'MMMM D [at] h:mm a';
const FullDateFormat = 'MMMM D, YYYY [at] h:mm a';


@Component({
  tag: 'live-datetime',
  styleUrl: 'live-datetime.css',
  shadow: true
})
export class LiveDatetime {


  @Prop() datetime:string | Moment;

  @State() momentDatetime:Moment;
  @State() textDatetime:string;
  @State() fullTextDatetime:string;


  componentWillLoad() {
    this.fullTextDatetime = moment(this.datetime).format(FullDateFormat);
    this.update();
  }


  // Update the display of the relative time and then set a timer for the next update.
  // TODO: Need to better handle long running pages so that we can even deal with update
  // of days, months or even years.  A better approach would be to exactly calculate when
  // the next change will really need to happen instead of the approximate values we are
  // currently using.
  private update() {
  	// console.info('DynamicDatetime.update() datetime', this.datetime);
  	this.momentDatetime = moment(this.datetime);
    this.textDatetime = this.updateTextDatetime(this.momentDatetime);
    // this.textDatetime = this.momentDatetime.fromNow();
    // console.log('DynamicDatetime.componentWillLoad() textDatetime', this.textDatetime);

    // Figure out when next to update the display depending on how far away from
    // the date we are.  These values are approximate.

    // Take the absolute value because frequency does not matter, only how far from now.
    let diff = Math.abs( moment().unix() - this.momentDatetime.unix());
    // console.info('diff', diff);
    // The default is every 5 seconds for within a minute of the date.
    let timeout = 5;  // 5 seconds
    // More than 60 seconds, we don't need to update more than every 15 seconds
    if (diff > 60)
      timeout = 15;  // 15 seconds
    // More than 2 minutes, we don't need to update more than every half minute
    if (diff > 120)
      timeout = 30;  // 30 seconds
    // More than an hour, update every 10 minutes.
    if (diff > 3600)
      timeout = 600;  // 10 minutes
    // More than a day, update every hour.
    if (diff > 24 * 3600)
      timeout = 3600;  // 1 hour
    // More than 2 days away, don't bother updating because we just show the datetime, not relative.
    if (diff > 2 * 24 * 3600) {
      // skipping update, display doesn't change often enough.
    } else {
      setTimeout(() => this.update(), timeout * 1000);
    }
  }


  private updateTextDatetime(datetime:Moment):string {
    let target = datetime.unix();
    let now = moment().unix();
    let diff = now - target;
    let template = (diff > 0 ? '{0} ago' : 'in {0}');

    // Round down to the nearest 5 secons so second counts always display as multiples of 5;
    diff = 5 * Math.floor(Math.abs(diff) / 5);

    // Generate the start and end of days arouund today
    let startOfToday:Moment = moment().startOf('day');
    let startOfYesterday:Moment = moment(startOfToday).subtract(1, 'day');
    let startOfTomorrow:Moment = moment(startOfToday).add(1, 'day');
    let endOfTomorrow:Moment = moment(startOfTomorrow).endOf('day');
    let startOfThisYear:Moment = moment(startOfToday).startOf('year');
    let endOfThisYear:Moment = moment(startOfToday).endOf('year');

    if (datetime < startOfThisYear || datetime > endOfThisYear)
      return moment(datetime).format(FullDateFormat);

    if (datetime < startOfYesterday || datetime > endOfTomorrow)
      return moment(datetime).format(CurrentYearDateFormat);

    if (datetime < startOfToday)
      return 'Yesterday at ' + moment(datetime).format('h:mm a');

    if (datetime >= startOfTomorrow)
      return 'Tomorrow at ' + moment(datetime).format('h:mm a');

    if (diff < 10)
      return 'now';

    let text:string;
    if (diff < 20)
    	text = 'a few seconds';

    else if (diff < 60)
      text = Math.floor(diff).toString() + ' seconds';

    else if (diff < 120)
    	text = 'a minute';

    else if (diff < 3600)
      text = Math.floor(diff/60).toString() + ' minutes';

    else if (diff < 7200)
      text = 'an hour';

    else if (diff < 3600 * 24)
      text = Math.floor(diff/3600).toString() + ' hours';
    else
	    // We have a date that we haven't handled so just display it.  Should not get here.
	    return moment(datetime).format(FullDateFormat);

	  // Format human readable difference in time with direction
  	return template.replace('{0}', text);
  }


  render() {
    return <Host title={this.fullTextDatetime}>{this.textDatetime}</Host>;
  }


}
