import express from "express";
import _ from "lodash";
import generator from "generate-password";
import { v4 as uuidv4 } from "uuid";

import usersModel from "./DB/models/users";
import historyModel from "./DB/models/history";
import dealersModel from "./DB/models/dealers";
import send_mail from "./utils/send_mail";

import type { IUser, ISession } from "../common/types/session";
import type { IDealer } from "../common/types/dealers";
import type { MongooseDocument, Error as MongooseError } from "mongoose";

const router = express.Router();

router.post("/list", (req, res) => {
  global.mvno_sessions_store.all((sessions_error, sessions: ISession[]) => {
    usersModel.find((error: MongooseError, result: MongooseDocument[]) => {
      if (error) {
        res.send({ error });
      } else {
        const users: IUser[] = result.map((r) => r.toObject());

        dealersModel.find((d_error: MongooseError, d_result: MongooseDocument[]) => {
          const dealers: IDealer[] = d_result.map((d) => d.toObject());

          if (d_error) {
            res.send({ error: d_error });
          } else {
            const sessions_with_user = Object.values(sessions).filter((s) => s.user);
            const online_ids_map = sessions_with_user.filter((s) => s.user.online).map((su) => su.user._id);

            const users_with_online = users.map((u) =>
              Object.assign(u, {
                online: online_ids_map.includes(String(u._id)),
                sessions: sessions_with_user
                  .filter((uf) => uf.user._id === String(u._id))
                  .map((ufa) => {
                    return {
                      id: uuidv4(),
                      ip: ufa.user.ip,
                      browser: ufa.ua ? ufa.ua.browser : "",
                      os: ufa.ua ? ufa.ua.os : "",
                      v: ufa.ua ? ufa.ua.version : "",
                      platform: ufa.ua ? ufa.ua.platform : "",
                      isMobile: ufa.ua ? ufa.ua.isMobile : ""
                    };
                  })
              })
            );

            res.send({ result: { users: users_with_online, dealers }});
          }
        });
      }
    });
  });
});

router.post("/create", async (req, res) => {
  const { role, login, name, email, phone, dlr_id } = req.body;

  if (!_.isEmpty(dlr_id) && !_.isEmpty(role) && !_.isEmpty(login) && !_.isEmpty(email)) {
    const pass = generator.generate({
      length: 10,
      numbers: true
    });
    const prep_email: string = email.toLowerCase().trim();
    const mail_body: string = `<div style="width: 100%;display: flex; justify-content: center; align-items: center; flex-direction: row;">
                            <div style="padding: 20px; width: 300px; border: 3px solid #ccc;">
                                <h4>Логин: ${login}</h4>
                                <h4>Пароль: ${pass}</h4>
                            </div>
                        </div>`;

    const send_result = await send_mail("Ваш пароль от MVNO-интерфейса", prep_email, mail_body).catch((error) => res.send({ error }));

    if (send_result) {
      const result = await usersModel.insertMany([{ id: 0, role, login: login.trim(), name: name.trim(), pass, email: prep_email, phone: phone.trim(), dlr_id }]).catch((error) => res.send({ error }));

      if (result) {
        res.send({ result: "ok" });
      }
    }
  } else {
    res.send({ error: "Empty required params" });
  }
});

router.post("/update", (req, res) => {
  const { data, _id } = req.body;

  if (!_.isEmpty(_id) && !_.isEmpty(data)) {
    usersModel.findByIdAndUpdate(_id, data, (error: MongooseError) => {
      if (error) {
        res.send({ error });
      } else {
        res.send({ result: "ok" });
      }
    });
  } else {
    res.send({ error: "Empty required params" });
  }
});

router.post("/send_password", (req, res) => {
  const { _id } = req.body;

  if (!_.isEmpty(_id)) {
    usersModel.findById(_id, async (error: MongooseError, resp: MongooseDocument) => {
      const user: IUser = resp.toObject();

      if (error) {
        res.send({ error });
      } else if (user) {
        const mail_body = `<div style="width: 100%;display: flex; justify-content: center; align-items: center; flex-direction: row;">
                                <div style="padding: 20px; width: 300px; border: 3px solid #ccc;">
                                    <h4>Логин: ${user.login}</h4>
                                    <h4>Пароль: ${user.pass}</h4>
                                </div>
                            </div>`;
        const send_result = await send_mail("Ваш пароль от MVNO-интерфейса", user.email, mail_body).catch((error) => res.send({ error }));

        if (send_result) {
          res.send({ result: "ok" });
        }
      } else {
        res.send({ error: `User with id ${_id} not found` });
      }
    });
  } else {
    res.send({ error: "Empty required params" });
  }
});

router.post("/rate", (req, res) => {
  historyModel.find({ "request.url": { $regex: "/api_v1/customer/activate" }}, async (error: MongooseError, resp: MongooseDocument[]) => {
    if (error) {
      res.send({ error });
    } else {
      const history = resp.map((d) => d.toObject());
      const grouped = _.values(_.groupBy(history, (g) => g.user.name));
      const activations_rate = grouped.map((g) => {
        return {
          user: g[0].user.name,
          rate: _.uniqBy(g, (gg) => {
            if (gg.data) {
              return gg.data.inn;
            }

            return gg.data;
          }).length
        };
      });

      historyModel.find({ "request.url": { $regex: "customer/toggle_service" }, "data.action": 1 }, async (error: MongooseError, resp: MongooseDocument[]) => {
        if (error) {
          res.send({ error });
        } else {
          const history = resp.map((d) => d.toObject());
          const grouped = _.values(_.groupBy(history, (g) => g.user.name));
          const packs_rate = grouped.map((g) => {
            return { user: g[0].user.name, rate: g.length };
          });

          res.send({ packs_rate: _.orderBy(packs_rate, "rate", "desc"), activations_rate: _.orderBy(activations_rate, "rate", "desc") });
        }
      });
    }
  });
});

export default router;
