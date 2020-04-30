import { generateHash } from "../hash";
import Label from "./label";
import Scene from "./scene";
import { mapAsync, createObjectSet } from "./utility";
import * as logger from "../logger";
import moment = require("moment");
import { actorCollection, labelledItemCollection } from "../database";
import LabelledItem from "./labelled_item";
import SceneView from "./watch";

export default class Actor {
  _id: string;
  name: string;
  aliases: string[] = [];
  addedOn = +new Date();
  bornOn: number | null = null;
  thumbnail: string | null = null;
  altThumbnail: string | null = null;
  hero?: string | null = null;
  avatar?: string | null = null;
  favorite: boolean = false;
  bookmark: number | null = null;
  rating: number = 0;
  customFields: any = {};
  labels?: string[]; // backwards compatibility
  studio?: string | null; // backwards compatibility
  description?: string | null = null;

  static getAge(actor: Actor) {
    if (actor.bornOn) return moment().diff(actor.bornOn, "years");
    return null;
  }

  static async checkIntegrity() {}

  static async remove(actor: Actor) {
    return actorCollection.remove(actor._id);
  }

  static async setLabels(actor: Actor, labelIds: string[]) {
    return Label.setForItem(actor._id, labelIds, "actor");
  }

  static async getLabels(actor: Actor) {
    return Label.getForItem(actor._id);
  }

  static async getById(_id: string) {
    return actorCollection.get(_id);
  }

  static async getAll(): Promise<Actor[]> {
    return actorCollection.getAll();
  }

  static async getWatches(actor: Actor) {
    const scenes = await Scene.getByActor(actor._id);

    return (
      await mapAsync(scenes, (scene) => {
        return SceneView.getByScene(scene._id);
      })
    )
      .flat()
      .sort((a, b) => a.date - b.date);
  }

  static async getTopActors() {
    const actors = await Actor.getAll();

    const scores = await mapAsync(actors, async (actor) => {
      const score =
        (await Scene.getByActor(actor._id)).length / 5 +
        (await Actor.getWatches(actor)).length +
        +actor.favorite * 5 +
        actor.rating;

      return {
        actor,
        score,
      };
    });

    scores.sort((a, b) => b.score - a.score);
    return scores.map((s) => s.actor);
  }

  constructor(name: string, aliases: string[] = []) {
    this._id = "ac_" + generateHash();
    this.name = name.trim();
    this.aliases = [...new Set(aliases.map((tag) => tag.trim()))];
  }

  static async getMovies(actor: Actor) {
    const scenes = await Scene.getByActor(actor._id);
    const movies = await mapAsync(scenes, Scene.getMovies);
    return createObjectSet(movies.flat(), "_id");
  }

  static async getCollabs(actor: Actor) {
    const scenes = await Scene.getByActor(actor._id);

    return await mapAsync(scenes, async (scene) => {
      return {
        scene,
        actors: (await Scene.getActors(scene)).filter(
          (ac) => ac._id != actor._id
        ),
      };
    });
  }
}
