"use strict";

const targetDate = "2024-03-03T00:00:00";

const infoHeader = document.querySelector(".info-header");
const segmentLabels = document.querySelectorAll(".segment-label");

[infoHeader, ...segmentLabels].forEach(
  (el) => (el.textContent = el.textContent.toUpperCase())
);

const getTimeSegment = function (segmentElement) {
  const segmentDisplay = segmentElement.querySelector(".segment-display");

  const segmentDisplayTop = segmentDisplay.querySelector(
    ".segment-display__top"
  );

  const segmentDisplayBottom = segmentDisplay.querySelector(
    ".segment-display__bottom"
  );

  const segmentOverlay = segmentDisplay.querySelector(".segment-overlay");

  const segmentOverlayTop = segmentOverlay.querySelector(
    ".segment-overlay__top"
  );

  const segmentOverlayBottom = segmentOverlay.querySelector(
    ".segment-overlay__bottom"
  );

  return {
    segmentDisplay,
    segmentDisplayTop,
    segmentDisplayBottom,
    segmentOverlay,
    segmentOverlayTop,
    segmentOverlayBottom,
  };
};

const updateSegmentValue = function (
  displayElement,
  overlayElement,
  timeValue
) {
  displayElement.textContent = timeValue;
  overlayElement.textContent = timeValue;
};

const updateTimeSegment = function (segmentElement, timeValue) {
  const segmentElements = getTimeSegment(segmentElement);

  if (
    parseInt(segmentElements.segmentDisplayTop.textContent) ===
    parseInt(timeValue)
  )
    return;

  updateSegmentValue(
    segmentElements.segmentDisplayTop,
    segmentElements.segmentOverlayBottom,
    timeValue
  );

  segmentElements.segmentDisplay.classList.add("flip");

  const finishAnimation = function () {
    segmentElements.segmentDisplay.classList.remove("flip");

    updateSegmentValue(
      segmentElements.segmentDisplayBottom,
      segmentElements.segmentOverlayTop,
      timeValue
    );

    this.removeEventListener("animationend", finishAnimation);
  };

  segmentElements.segmentDisplay.addEventListener(
    "animationend",
    finishAnimation
  );
};

const getTimeRemaining = function () {
  const targetTimeStamp = new Date(targetDate).getTime();
  const nowTime = Date.now();

  const secondsRemaining = Math.floor((targetTimeStamp - nowTime) / 1000);

  const days = (Math.floor(secondsRemaining / 86400) + "").padStart(2, "0");
  const hours = (Math.floor((secondsRemaining % 86400) / 3600) + "").padStart(
    2,
    "0"
  );
  const minutes = (
    Math.floor(((secondsRemaining % 86400) % 3600) / 60) + ""
  ).padStart(2, "0");
  const seconds = ((((secondsRemaining % 86400) % 3600) % 60) + "").padStart(
    2,
    "0"
  );

  const complete = 0 >= secondsRemaining;

  return { days, hours, minutes, seconds, complete };
};

const updateTimeSection = function (id, timeValue) {
  const sectionElement = document.getElementById(id);

  updateTimeSegment(sectionElement, timeValue);
};

const updateAllSegments = function () {
  const timeRemainingBits = getTimeRemaining();

  updateTimeSection("days", timeRemainingBits.days);
  updateTimeSection("hours", timeRemainingBits.hours);
  updateTimeSection("minutes", timeRemainingBits.minutes);
  updateTimeSection("seconds", timeRemainingBits.seconds);

   if (timeRemainingBits.complete) {
    updateTimeSection("days", "00");
    updateTimeSection("hours", "00");
    updateTimeSection("minutes", "00");
    updateTimeSection("seconds", "00");
  }

  return timeRemainingBits.complete;
};

const countdownTimer = setInterval(function () {
  const isComplete = updateAllSegments();

  if (isComplete) clearInterval(countdownTimer);
});
