export default class Scheduler {
  concurrency = 1
  running = 0
  queue = []
  add (task) {
    return new Promise(resolve => {
      this.queue.push({
        taskGenerator: task,
        resolve
      })
      this.schedule()
    })
  }
  // 除第一次主动 执行队列外， 之后的队列都得主动调用此方法
  schedule () {
    while (this.queue.length > 0 && this.running < this.concurrency) {
      const curTask = this.queue.shift()
      this.running += 1
      curTask.taskGenerator().then(result => {
        this.running -= 1
        curTask.resolve(result)
        // this.schedule()
      })
    }
  }
}
