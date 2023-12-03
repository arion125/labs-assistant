import { dockToStarbase } from "../actions/dockToStarbase";
import { loadAmmo } from "../actions/loadAmmo";
import { loadCargo } from "../actions/loadCargo";
import { loadFuel } from "../actions/loadFuel";
import { startMining } from "../actions/startMining";
import { stopMining } from "../actions/stopMining";
import { undockFromStarbase } from "../actions/undockFromStarbase";
import { unloadCargo } from "../actions/unloadCargo";
import { MAX_AMOUNT } from "../common/constants";
import { NotificationMessage } from "../common/notifications";
import { Resources } from "../common/resources";
import { actionWrapper } from "../utils/actionWrapper";
import { prepareForMining } from "../utils/prepareForMining";
import { sendNotification } from "../utils/sendNotification";

const run = async () => {
  const fleetName = "Flotta ALPHA";
  const miningTimeAndResourcesAmount = await prepareForMining(
    fleetName,
    Resources.Hydrogen,
    [0, -39]
  );
  while (true) {
    try {
      await actionWrapper(loadFuel, fleetName, MAX_AMOUNT);
      await actionWrapper(loadAmmo, fleetName, MAX_AMOUNT);
      await actionWrapper(
        loadCargo,
        fleetName,
        Resources.Food,
        miningTimeAndResourcesAmount.food
      );
      await actionWrapper(undockFromStarbase, fleetName);
      await actionWrapper(
        startMining,
        fleetName,
        Resources.Hydrogen,
        miningTimeAndResourcesAmount.timeInSeconds
      );
      await actionWrapper(stopMining, fleetName, Resources.Hydrogen);
      await actionWrapper(dockToStarbase, fleetName);
      await actionWrapper(
        unloadCargo,
        fleetName,
        Resources.Hydrogen,
        MAX_AMOUNT
      );
      await sendNotification(
        NotificationMessage.MINING_SUCCESS,
        fleetName,
        Resources.Hydrogen,
        12201
      );
    } catch (e) {
      await sendNotification(NotificationMessage.MINING_ERROR, fleetName);
    }
  }
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});