/** Coalesces concurrent notification synchronization work into one in-flight pass. */
export class NotificationSyncSession {
  #inFlight = false;
  #pending = false;
  #syncCount = 0;

  /** Runs sync work once; overlapping calls schedule a single follow-up pass. */
  async run(sync: () => Promise<void>): Promise<void> {
    if (this.#inFlight) {
      this.#pending = true;
      return;
    }

    this.#inFlight = true;

    try {
      this.#syncCount += 1;
      await sync();
    } finally {
      this.#inFlight = false;

      if (this.#pending) {
        this.#pending = false;
        await this.run(sync);
      }
    }
  }

  /** Number of completed synchronization passes (for regression tests). */
  get syncCount(): number {
    return this.#syncCount;
  }

  /** Whether a synchronization pass is currently running. */
  get isInFlight(): boolean {
    return this.#inFlight;
  }
}
