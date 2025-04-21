import { inject, injectable } from "inversify";
import { CardBasicModel, CardModel } from "../../models/models";
import DALS_TYPES from "../../interfaces/dals/dal.types";
import { IAbstractDal } from "../../interfaces/dals/iabstract.dals";
import { AbstractService } from "./abstract.service";
import { ICardService } from "../../interfaces/services/icards.service";

@injectable()
export class CardsService
  extends AbstractService<CardModel>
  implements ICardService
{
  constructor(
    @inject(DALS_TYPES.CardsDal)
    private readonly cardsDal: IAbstractDal<CardModel>
  ) {
    super(cardsDal);
  }

  async findAllBasic(): Promise<CardBasicModel[]> {
    return (await this.findAll()).map((item: CardModel) => ({
      id: item.id,
      name: item.name,
      value: item.value,
    }));
  }
}
