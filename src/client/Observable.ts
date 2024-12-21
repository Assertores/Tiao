export type Subscription<T> = (event: T) => any

export class Token {
  public id: string
  public destroy(): void {}

  constructor(hookId: string, destroyCallback: () => void) {
    this.id = hookId
    this.destroy = destroyCallback
  }
}

export class Observable<T> {
  private hooks: { [id: string]: Subscription<T> } = {}

  constructor(private _value: T) {}

  get value(): T {
    return this._value
  }

  public subscribe(id: string, listener: Subscription<T>): Token {
    if (id == null)
      throw new Error('[Hooks] Id cannot be null, use "addUnique" instead')
    this.hooks[id] = listener

    return new Token(id, () => {
      this.remove(id)
    })
  }

  private remove(hookId: string | Token): void {
    if (hookId instanceof Token) {
      return this.remove(hookId.id)
    }

    delete this.hooks[hookId]
  }

  public set(newValue: T): void {
    this._value = newValue

    const keys: string[] = Object.keys(this.hooks)

    for (let i: number = keys.length; i--; ) {
      if (this.hooks[keys[i]] == null) {
        this.remove(keys[i])
        continue
      }

      this.hooks[keys[i]](newValue)
    }
  }
}
