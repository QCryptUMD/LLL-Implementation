import styles from "./LLLComponent.module.css";
import { LLLProcess } from "./LLLFunctions";
import { useState, useRef } from "react";
import BasisDisplay from "./BasisDisplay/BasisDisplay";
import HelpModal from "./HelpModal/HelpModal";

const LLLComponent = () => {
  const [parameters, setParameters] = useState({
    delta: "",
    number: "",
    size: "",
  });

  const ref = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [helpModal, setHelpModal] = useState(false);
  const [vectors, setVectors] = useState([]);
  const [textVectors, setTextVectors] = useState("");
  const [basis, setBasis] = useState("");

  const handleVectorChange = (e, numberIndex, sizeIndex) => {
    if (e.target.value.match(/^-?[0-9]*$/) != null) {
      const vectorObject = { ...vectors };
      const name = `${numberIndex} ${sizeIndex}`;
      vectorObject[name] = e.target.value;
      setVectors(vectorObject);
      if (errorMessage.includes("All the vectors must be filled in")) {
        setErrorMessage("");
      }
    }
  };

  /* Makes sure that the entered values for the number and size of vectors are integers*/
  const handleVectorParameterInput = (e) => {
    if (e.target.value.match(/^[0-9]*$/) != null) {
      setParameters({
        ...parameters,
        [e.target.name]: e.target.value.replace(/-\.e/, ""),
      });
      setVectors([]);
      if (!errorMessage.includes("0.25")) {
        setErrorMessage("");
      }
    }
  };

  /* Parses the textual vector input and return an array of vectors if the input is correct */
  const parse = () => {
    let textLength = textVectors.length;
    let index = 0;
    let allVectors = [];
    let currVector = null;
    let semicolonNeeded = false;
    while (index < textLength) {
      const currString = textVectors.substring(index);
      if (currString.match(/^[\n\t ]+/) != null) {
        const match = currString.match(/[\n\t ]+/);
        index += match[0].length;
      } else if (currString.match(/^\[/) != null) {
        if (currVector != null) {
          setErrorMessage(
            `Array bracket mismatch. Error starts with ${textVectors.substring(
              index,
              index + 10
            )}`
          );
          return;
        } else if (semicolonNeeded) {
          setErrorMessage(
            `Missing semicolon between vectors. Error starts with ${textVectors.substring(
              index,
              index + 10
            )}`
          );
          return;
        } else {
          currVector = [];
          index++;
        }
      } else if (currString.match(/^\]/) != null) {
        if (currVector == null) {
          setErrorMessage(
            `Array bracket mismatch. Error starts with ${textVectors.substring(
              index,
              index + 10
            )}`
          );
          return;
        } else if (semicolonNeeded) {
          setErrorMessage(
            `Missing semicolon between vectors. Error starts with ${textVectors.substring(
              index,
              index + 10
            )}`
          );
          return;
        } else if (currVector.length != parameters.size) {
          setErrorMessage(`Vector size does not match the size parameter. \
                           The first few elements of the vector are ${String(
                             currVector
                           ).substring(0, 10)}`);
          return;
        } else {
          allVectors.push(currVector);
          currVector = null;
          semicolonNeeded = true;
          index++;
        }
      } else if (currString.match(/^;/) != null) {
        if (semicolonNeeded) {
          semicolonNeeded = false;
          index++;
        } else {
          setErrorMessage(
            `Unexpected semicolon. Error starts with ${textVectors.substring(
              index,
              index + 10
            )}`
          );
          return;
        }
      } else if (currString.match(/^-?[0-9]+/) != null) {
        const intMatch = currString.match(/^-?[0-9]+/);
        if (currVector == null || semicolonNeeded) {
          setErrorMessage(
            `Integer found before vector starts. Error starts with ${textVectors.substring(
              index,
              index + 10
            )}`
          );
          return;
        } else if (currString.match(/^-?[0-9]+[\n\t ]*,/) != null) {
          const fullMatch = currString.match(/^-?[0-9]+[\n\t ]*,/);
          currVector.push(parseInt(intMatch));
          index += fullMatch[0].length;
        } else if (currString.match(/^-?[0-9]+[\n\t ]*]/) != null) {
          const fullMatch = currString.match(/^-?[0-9]+[\n\t ]*]/);
          currVector.push(parseInt(intMatch));
          index += fullMatch[0].length - 1;
        } else {
          setErrorMessage(
            `Comma not found after integer "${intMatch}". Error starts at ${textVectors.substring(
              index,
              index + 10
            )}`
          );
          return;
        }
      } else {
        setErrorMessage(
          `Error parsing input. Error starts with ${textVectors.substring(
            index,
            index + 10
          )}`
        );
        return;
      }
    }
    if (allVectors.length != parameters.number) {
      setErrorMessage(
        "Number of inputted vectors does not match the number parameter"
      );
      return;
    }

    return allVectors;
  };

  const handleSubmit = () => {
    // add linear independence check
    if (
      !(parameters.delta > 0.25 && parameters.delta <= 1) &&
      parameters.delta != ""
    ) {
      setErrorMessage(
        "Delta must be greater than 0.25 and less than or equal to 1"
      );
      window.scrollTo(0, 0);
    } else if (!(parameters.size > 0 && parameters.number > 0)) {
      setErrorMessage(
        "The number and size of vectors must be positive integers"
      );
      window.scrollTo(0, 0);
    } else if (parameters.number > 5 || parameters.size > 5) {
      let basisArray;
      const parseArray = parse();
      if (parseArray != undefined) {
        basisArray = LLLProcess(
          parseArray,
          parameters.delta == "" ? 0.75 : parameters.delta,
          []
        );
        setBasis(basisArray);
        ref.current?.scrollIntoView({ behavior: "smooth" });
        console.log(ref.current);
      } else {
        window.scrollTo(0, 0);
      }
    } else {
      let basisArray;
      if (Object.keys(vectors).length != parameters.number * parameters.size) {
        setErrorMessage("All the vectors must be filled in");
        return;
      } else {
        const vectorsArray = [];
        let index = 0;
        let subArray = [];
        Object.keys(vectors)
          .sort()
          .forEach((element) => {
            index++;
            subArray.push(parseInt(vectors[element]));
            if (index % parameters.size == 0) {
              vectorsArray.push(subArray);
              subArray = [];
            }
          });
        basisArray = LLLProcess(
          vectorsArray,
          parameters.delta == "" ? 0.75 : parameters.delta,
          []
        );
        console.log(basisArray);
        setBasis(basisArray);
        ref.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <div className={styles.content}>
        <div className={styles.parameters}>
          <div className={styles.error}>{errorMessage}</div>
          <div className={styles.inputContainer}>
            <p className={styles.label}>Delta (default is 0.75) </p>
            <input
              type="number"
              onChange={(e) => {
                setParameters({ ...parameters, delta: e.target.value });
                if (errorMessage.includes("0.25")) {
                  setErrorMessage("");
                }
              }}
              className={styles.parameterInput}
              value={parameters.delta}
            ></input>
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.label}>Number of Vectors </p>
            <input
              name="number"
              onChange={(e) => handleVectorParameterInput(e)}
              className={styles.parameterInput}
              value={parameters.number}
            ></input>
          </div>{" "}
          <div className={styles.inputContainer}>
            <p className={styles.label}>Size of Vectors </p>
            <input
              name="size"
              onChange={(e) => handleVectorParameterInput(e)}
              className={styles.parameterInput}
              value={parameters.size}
            ></input>
          </div>
          <div className={styles.vectorContainer}>
            {!(parameters.size > 0 && parameters.number > 0) ? (
              <></>
            ) : parameters.number <= 5 && parameters.size <= 5 ? (
              Array.from(Array(parseInt(parameters.number)).keys()).map(
                (numberIndex) => {
                  return (
                    <div className={styles.vectors} key={numberIndex}>
                      <div className={styles.vector}>
                        <p key={numberIndex}>
                          <b>
                            <i>
                              v<sub>{numberIndex}</sub>
                            </i>
                          </b>
                        </p>
                        {Array.from(
                          Array(parseInt(parameters.size)).keys()
                        ).map((sizeIndex) => {
                          return (
                            <input
                              onChange={(e) =>
                                handleVectorChange(e, numberIndex, sizeIndex)
                              }
                              className={styles.vectorInput}
                              key={sizeIndex}
                              value={
                                vectors[`${numberIndex} ${sizeIndex}`] ==
                                undefined
                                  ? ""
                                  : vectors[`${numberIndex} ${sizeIndex}`]
                              }
                            ></input>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <div className={styles.vectorTextContainer}>
                <div className={styles.vectorLabel}>Vectors</div>
                <div className={styles.helpBoxContainer}>
                  <button
                    className={styles.helpBox}
                    onClick={() => setHelpModal(true)}
                  >
                    Help
                  </button>
                  <HelpModal
                    open={helpModal}
                    onClose={() => setHelpModal(!helpModal)}
                  />
                  <textarea
                    className={styles.vectorText}
                    onChange={(e) => setTextVectors(e.target.value)}
                  ></textarea>
                </div>
              </div>
            )}
          </div>
          <div className={styles.buttons}>
            <button
              className={styles.submitButton}
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setErrorMessage("");
                  handleSubmit();
                }, 300);
              }}
              disabled={loading}
            >
              {loading ? (
                <div className={styles.spinner}></div>
              ) : (
                <div>Calculate LLL Vectors</div>
              )}
            </button>
            <button
              className={styles.clearButton}
              onClick={() => {
                setParameters({
                  delta: "",
                  number: "",
                  size: "",
                });
                setVectors([]);
                setErrorMessage("");
                setTextVectors("");
                window.scrollTo(0, 0);
                setBasis("");
              }}
              disabled={loading}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
      {basis != "" ? <BasisDisplay basis={basis} ref={ref} /> : <></>}
    </div>
  );
};

export default LLLComponent;
