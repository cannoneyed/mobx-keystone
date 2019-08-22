import { Simple, simpleKey } from "../simple"
import { ParentPath } from "../parent/path"
import { setParent } from "../parent/setParent"
import { setInternalSnapshot } from "../snapshot/internal"
import { tweakedObjects } from "./core"

/**
 * @ignore
 */
export function tweakSimple<S extends object, T extends Simple<S>>(
  simpleObj: T,
  parentPath: ParentPath<any> | undefined
): T {
  tweakedObjects.add(simpleObj)
  setParent(simpleObj, parentPath)

  setInternalSnapshot(simpleObj, {
    [simpleKey]: true,
    data: simpleObj.toSnapshot(),
    fromSnapshot: (simpleObj.constructor as any).fromSnapshot,
  })
  return simpleObj
}
