import { SnapshotInOfSimple } from "../snapshot"
import { isPlainObject } from "../utils"

/**
 * @ignore
 */
export const simpleKey = "$simple"

/**
 * An abstract base class representing a simple, serializable and immutable class.
 */
export abstract class Simple<Serialized extends object> {
  abstract toSnapshot(): Serialized
  abstract fromSnapshot(snapshot: Serialized): Simple<Serialized>
}

/**
 * Checks if an snapshot is an snapshot for a simple class.
 *
 * @param snapshot
 * @returns
 */
export function isSimpleSnapshot<S extends object>(
  snapshot: any
): snapshot is SnapshotInOfSimple<Simple<S>> {
  return isPlainObject(snapshot) && !!snapshot[simpleKey]
}
