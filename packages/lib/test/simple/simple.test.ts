import {
  fromSnapshot,
  // getParent,
  // getRoot,
  getSnapshot,
  model,
  Model,
  prop,
  runUnprotected,
} from "../../src"
import { Simple } from "../../src/simple"
import "../commonSetup"
// import { emulateProdMode } from "../utils"

interface FractionSnapshot {
  readonly numerator: number
  readonly denominator: number
}

class Fraction extends Simple<FractionSnapshot> {
  constructor(public readonly numerator: number, public readonly denominator: number) {
    super()
    this.initialSnapshot()
  }

  toSnapshot() {
    return { numerator: this.numerator, denominator: this.denominator }
  }

  static fromSnapshot(snapshot: FractionSnapshot) {
    return new Fraction(snapshot.numerator, snapshot.denominator)
  }
}

@model("P")
class P extends Model({
  fraction: prop<Fraction>(),
}) {}

describe("simple", () => {
  test("should be able to create a simple node", () => {
    const numerator = 1
    const denominator = 2
    const fraction = new Fraction(numerator, denominator)

    expect(fraction instanceof Simple).toBe(true)

    const sn = getSnapshot(fraction)
    expect(sn.data.numerator).toStrictEqual(numerator)
    expect(sn.data.denominator).toStrictEqual(denominator)

    const frBack = fromSnapshot<Fraction>(sn)
    expect(frBack instanceof Simple).toBe(true)
    expect(frBack instanceof Fraction).toBe(true)
    expect(frBack).not.toBe(fraction)
    expect(frBack.numerator).toBe(sn.data.numerator)
    expect(frBack.denominator).toBe(sn.data.denominator)

    const p = new P({ fraction })
    expect(getSnapshot(p).fraction).toBe(sn)
    // expect(getParent(fraction)).toBe(p.$)
    // expect(getRoot(fraction)).toBe(p)

    runUnprotected(() => {
      ;(p as any).fraction = undefined
    })

    expect(getSnapshot(p).fraction).toBe(undefined)
    // expect(getParent(fraction)).toBe(undefined)
    // expect(getRoot(fraction)).toBe(fraction)
  })
})
