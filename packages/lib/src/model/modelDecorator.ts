import { HookAction } from "../action/hookActions"
import { wrapModelMethodInActionIfNeeded } from "../action/wrapInAction"
import { logWarning } from "../utils"
import { AnyModel, ModelClass } from "./BaseModel"
import { modelInfoByClass, modelInfoByName } from "./modelInfo"
import { modelInitializersSymbol } from "./modelSymbols"
import { assertIsModelClass } from "./utils"

/**
 * Decorator that marks this class (which MUST inherit from the `Model` abstract class)
 * as a model.
 *
 * @param name Unique name for the model type. Note that this name must be unique for your whole
 * application, so it is usually a good idea to use some prefix unique to your application domain.
 */
export const model = (name: string) => (clazz: ModelClass<AnyModel>) => {
  assertIsModelClass(clazz, "a model class")

  if (modelInfoByName[name]) {
    logWarning(
      "error",
      `a model with name "${name}" already exists (if you are using hot-reloading this might be the cause)`
    )
  }

  // trick so plain new works
  const obj = {
    [clazz.name]: function(initialData: any, snapshotInitialData: any) {
      const instance = new (clazz as any)(initialData, snapshotInitialData)

      // the object is ready
      if (instance.onInit) {
        wrapModelMethodInActionIfNeeded(instance, "onInit", HookAction.OnInit)

        instance.onInit()
      }

      return instance
    },
  }
  const newClazz: any = obj[clazz.name]
  newClazz.prototype = clazz.prototype
  newClazz[modelInitializersSymbol] = (clazz as any)[modelInitializersSymbol]

  const modelInfo = {
    name,
    class: newClazz,
  }

  modelInfoByName[name] = modelInfo

  modelInfoByClass.set(newClazz, modelInfo)
  modelInfoByClass.set(clazz, modelInfo)

  return newClazz
}
