import BigNumber from "bignumber.js";
import Vector from "../Vector/Vector";
import styles from "./BasisDisplay.module.css";
import React from "react";

const BasisDisplay = (props, ref) => {
  const basis = props.basis;
  let basisNumber = 0;
  return (
    <div className={styles.container} ref={ref}>
      {basis.map((eachBasis) => {
        basisNumber++;
        let vectorNumber = -1;
        let titleString = "";
        if (basisNumber == 1) {
          if (basis.length == 1) {
            titleString = "The original and final basis is";
          } else {
            titleString = "The original basis is";
          }
        } else {
          titleString = `The basis after ${basisNumber - 1} run${
            basisNumber - 1 == 1 ? "" : "s"
          } of the for loop is`;
        }

        return (
          <div className={styles.basis}>
            <p>{titleString}</p>
            <div className={styles.vectorsContainer}>
              {eachBasis.map((vector) => {
                vectorNumber++;
                const vectorComponents = [];
                vector.map((element) => {
                  vectorComponents.push(element.toNumber());
                });
                let sum = new BigNumber("0");
                vectorComponents.map(
                  (element) =>
                    (sum = sum.plus(
                      new BigNumber(`${element}`).multipliedBy(
                        new BigNumber(`${element}`)
                      )
                    ))
                );
                const length = Math.sqrt(sum.toNumber()).toFixed(2);
                return (
                  <div className={styles.vector}>
                    <div className={styles.vectorLabel}>
                      <i>
                        <b>
                          v<sub>{vectorNumber}</sub>
                        </b>
                      </i>
                    </div>
                    <Vector array={vectorComponents} />
                    <div className={styles.length}>{`Length: ${length}`}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default React.forwardRef(BasisDisplay);
