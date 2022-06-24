import {
  Table,
  Column,
  PrimaryKey,
  Model,
  DataType,
} from "sequelize-typescript";
import { SequelizeModelFactory } from "./sequelize-model-factory";
import _chance from "chance";
import { validate as uuidValidate } from "uuid";
import { setupSequelize } from "../testing";

const chance = _chance();

@Table({})
class StubModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id;

  @Column({
    allowNull: false,
    type: DataType.STRING(255),
  })
  declare name;

  static mockFactory = jest.fn(() => ({
    id: chance.guid({ version: 4 }),
    name: chance.word(),
  }));

  static factory() {
    return new SequelizeModelFactory(StubModel, StubModel.mockFactory);
  }
}

describe("SequelizeModelFactory Unit Tests", () => {
  setupSequelize({ models: [StubModel] });

  test("create method", async () => {
    let model = await StubModel.factory().create();
    expect(uuidValidate(model.id)).toBeTruthy();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();
    let modelFound = await StubModel.findByPk(model.id);
    expect(model.id).toBe(modelFound.id);

    model = await StubModel.factory().create({
      id: "a99e642f-1ef4-415d-97bd-82b98002b457",
      name: "some name",
    });
    expect(model.id).not.toBeNull();
    expect(model.id).toBe("a99e642f-1ef4-415d-97bd-82b98002b457");
    expect(model.name).toBe("some name");

    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
    modelFound = await StubModel.findByPk(model.id);
    expect(model.id).toBe(modelFound.id);
  });

  test("make method", async () => {
    let model = await StubModel.factory().make();
    expect(uuidValidate(model.id)).toBeTruthy();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();

    model = await StubModel.factory().make({
      id: "a99e642f-1ef4-415d-97bd-82b98002b457",
      name: "some name",
    });

    expect(model.id).toBe("a99e642f-1ef4-415d-97bd-82b98002b457");
    expect(model.name).toBe("some name");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
  });
});
