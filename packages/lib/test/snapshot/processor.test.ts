import { fromSnapshot, model, Model, modelSnapshotInWithMetadata, prop } from "../../src"
import "../commonSetup"

@model("P3")
export class P3 extends Model({
  arr: prop<number[]>(() => []),
}) {
  fromSnapshot(sn: { y: string }) {
    return {
      arr: sn.y.split(",").map(x => +x),
    }
  }
}

test("snapshot processor", () => {
  const p = fromSnapshot<P3>(
    modelSnapshotInWithMetadata(P3, {
      y: "30,40,50",
    })
  )

  expect(p.arr).toEqual([30, 40, 50])
})
