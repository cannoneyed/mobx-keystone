import { SnapshotInOfSimple } from "../snapshot"
import { isPlainObject } from "../utils"
import { tweak } from "../tweaker/tweak"

/**
 * @ignore
 */
export const simpleKey = "$simple"

/**
 * An abstract base class representing a simple, serializable and immutable class.
 */
export abstract class Simple<Serialized extends object> {
  abstract toSnapshot(): Serialized

  // Can't define abstract static methods...
  // static fromSnapshot(snapshot: Serialized): Simple<Serialized>

  protected initialSnapshot() {
    tweak(this, undefined)
  }
}

/**
 *
 * Checks if an snapshot is an snapshot for a simple class.
 * @param snapshot
 * @returns
 */
export function isSimpleSnapshot<S extends object>(
  snapshot: any
): snapshot is SnapshotInOfSimple<Simple<S>> {
  return isPlainObject(snapshot) && !!snapshot[simpleKey]
}
