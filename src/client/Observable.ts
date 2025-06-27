export type Subscription = () => unknown

export class Token {
  public id: Subscription
  public destroy: () => void

  constructor(hookId: Subscription, destroyCallback: () => void) {
    this.id = hookId
    this.destroy = destroyCallback
  }
}

export class Observable<T> {
  private hooks: Set<Subscription> = new Set<Subscription>()

  constructor(private _value: T) {}

  get value(): T {
    return this._value
  }

  public subscribe(listener: Subscription): Token {
    this.hooks.add(listener)

    return new Token(listener, () => {
      this.hooks.delete(listener)
    })
  }

  public set(newValue: T): void {
    this._value = newValue

    this.hooks.forEach((element: Subscription) => {
      element()
    })
  }
}
