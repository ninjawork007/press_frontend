import moment from "moment-business-days";

class DateHandler {
  constructor() {
    this.date = new Date();
  }

  formatDate(date) {
    return moment(date).format("MM/DD/YY");
  }

  formatDateByDay(date) {
    let dateDiff = moment(date).diff(moment(), "days");
    if (dateDiff == 0) {
      return "Today";
    } else if (dateDiff == 1) {
      return "Yesterday";
    } else {
      return moment(date).format("ddd, MMM DD");
    }
  }

  getDay() {
    return this.date.getDay();
  }

  getMonth() {
    return this.date.getMonth();
  }

  getYear() {
    return this.date.getFullYear();
  }

  daysSince(date) {
    if (!date) {
      return "N/A";
    }
    let momentDate = moment(date);
    let today = moment(new Date());
    let diff = today.diff(momentDate, "days");
    if (diff === 0) {
      let hours = today.diff(momentDate, "hours");
      if (hours === 0) {
        let minutes = today.diff(momentDate, "minutes");
        if (minutes === 0) {
          return "Just Now";
        }
        return minutes + " Minutes Ago";
      }
      return hours + " Hours Ago";
    }
    return diff + " Days Ago";
  }

  convertStringToDays(turnaround_time) {
    let minimumDays = 1;
    let maximumDays = 1;
    turnaround_time = turnaround_time.toLowerCase();

    if (turnaround_time.includes("week")) {
      const numberOfWeeks = turnaround_time.split(" ")[0];
      if (numberOfWeeks.includes("-")) {
        minimumDays = parseInt(numberOfWeeks.split("-")[0]) * 7;
        maximumDays = parseInt(numberOfWeeks.split("-")[1]) * 7;
      } else {
        minimumDays = parseInt(numberOfWeeks) * 7;
        maximumDays = parseInt(numberOfWeeks) * 7;
      }
    } else {
      const days = turnaround_time.split(" ")[0];
      if (days.includes("-")) {
        minimumDays = parseInt(days.split("-")[0]);
        maximumDays = parseInt(days.split("-")[1]);
      } else {
        minimumDays = parseInt(days);
        maximumDays = parseInt(days);
      }
    }

    return { minimumDays, maximumDays };
  }

  calculateEarliestDueDate(turnaround_time, start_date) {
    if (!turnaround_time || !start_date) {
      return null;
    }
    const { minimumDays } = this.convertStringToDays(turnaround_time);

    const earliestDate = moment(start_date).businessAdd(minimumDays, "days");
    return earliestDate.format("ddd MM/DD");
  }

  calculateLatestDueDate(turnaround_time, start_date) {
    if (!turnaround_time || !start_date) {
      return null;
    }
    const { maximumDays } = this.convertStringToDays(turnaround_time);

    const latestDate = moment(start_date).businessAdd(maximumDays, "days");
    return latestDate.format("ddd MM/DD");
  }

  calculateDueDateRange(turnaround_time, start_date) {
    if (!turnaround_time || !start_date) {
      return null;
    }
    const { minimumDays, maximumDays } =
      this.convertStringToDays(turnaround_time);

    const earliestDate = moment(start_date).businessAdd(minimumDays, "days");
    const latestDate = moment(start_date).businessAdd(maximumDays, "days");

    if (earliestDate.isSame(latestDate)) {
      return earliestDate.format("ddd MM/DD");
    } else {
      return `${earliestDate.format("ddd MM/DD")} - ${latestDate.format(
        "ddd MM/DD"
      )}`;
    }
  }

  checkIfDateIsOverdue(turnaround_time, start_date) {
    if (!turnaround_time || !start_date) {
      return null;
    }

    let today = moment(new Date());

    const { maximumDays } = this.convertStringToDays(turnaround_time);

    const latestDate = moment(start_date).businessAdd(maximumDays, "days");

    return today.isAfter(latestDate);
  }
}

export default new DateHandler();
