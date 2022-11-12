export function timer(callback, delay) {
  var id,
    started,
    remaining = delay,
    running;

  this.start = function () {
    running = true;
    started = new Date();
    id = setTimeout(callback, remaining);
  };

  this.pause = function () {
    running = false;
    clearTimeout(id);
  };

  this.getTimeLeft = function () {
    if (running) {
      this.pause();
      this.start();
    }

    return remaining;
  };

  this.getStateRunning = function () {
    return running;
  };

  this.getRemaining = function () {
    return (new Date() as any) - started;
  };

  this.delay = function () {
    return delay;
  };

  this.start();
}
