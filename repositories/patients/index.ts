import { people_v1 } from "@googleapis/people";
import Get from "./get";
import Create, { CreatePatient } from "./create";

export default class PatientsRepository {
  private readonly _get: Get;
  private readonly _create: Create;

  constructor(private readonly peopleClient: people_v1.People) {
    this._get = new Get(this.peopleClient);
    this._create = new Create(this.peopleClient);
  }
  public get() {
    return this._get.get();
  }
  public create(patient: CreatePatient) {
    return this._create.create(patient);
  }
}

export type { CreatePatient };
