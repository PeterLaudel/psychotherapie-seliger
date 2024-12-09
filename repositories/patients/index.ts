import getPatients from "./get";
import createPatient from "./create";
import { Repository } from "./shared";

export default class PatientsRepository extends Repository {
  public get = getPatients;
  public create = createPatient;
}
