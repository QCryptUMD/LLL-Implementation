import BigNumber from "bignumber.js";

const convertVector = (vector) => {
  const decimalVector = [];
  vector.map((element) => {
    decimalVector.push(new BigNumber(`${element}`));
  });
  return decimalVector;
};

const multiplyVector = (vector, multiplier) => {
  return vector.map((element) =>
    element.multipliedBy(new BigNumber(`${multiplier}`))
  );
};

const subtractVectors = (vectorOne, vectorTwo) => {
  const finalVector = [];
  for (let index = 0; index < vectorOne.length; index++) {
    finalVector.push(vectorOne[index].minus(vectorTwo[index]));
  }
  return finalVector;
};

const magnitudeVector = (vector) => {
  return dotProduct(vector, vector);
};

const dotProduct = (vectorOne, vectorTwo) => {
  let sum = new BigNumber("0");
  for (let index = 0; index < vectorOne.length; index++) {
    sum = sum.plus(vectorOne[index].multipliedBy(vectorTwo[index]));
  }
  return sum;
};

const computeGramSchmidt = (basis) => {
  const orthogonalBasis = [];
  basis.map((vector) => {
    const decimalVector = convertVector(vector);
    let difference = decimalVector;
    orthogonalBasis.map((orthogonalVector) => {
      const decimalOrthoVector = convertVector(orthogonalVector);
      const factor = dotProduct(decimalVector, decimalOrthoVector).dividedBy(
        magnitudeVector(decimalOrthoVector)
      );
      difference = subtractVectors(
        difference,
        multiplyVector(decimalOrthoVector, factor)
      );
    });
    orthogonalBasis.push(difference);
  });

  return orthogonalBasis;
};

export const LLLProcess = (basis, delta, acc) => {
  const decimalBasis = basis.map((element) => convertVector(element));
  acc.push(decimalBasis);
  const orthogonalBasis = computeGramSchmidt(basis);

  for (let indexOne = 1; indexOne < basis.length; indexOne++) {
    for (let indexTwo = indexOne - 1; indexTwo >= 0; indexTwo--) {
      const coefficient = dotProduct(
        decimalBasis[indexOne],
        orthogonalBasis[indexTwo]
      )
        .dividedBy(magnitudeVector(orthogonalBasis[indexTwo]))
        .toNumber();

      const roundedCoef = Math.round(coefficient);
      decimalBasis[indexOne] = subtractVectors(
        decimalBasis[indexOne],
        multiplyVector(decimalBasis[indexTwo], new BigNumber(`${roundedCoef}`))
      );
    }
  }

  for (let indexOne = 0; indexOne < basis.length - 1; indexOne++) {
    if (
      new BigNumber(delta)
        .multipliedBy(magnitudeVector(decimalBasis[indexOne]))
        .comparedTo(magnitudeVector(decimalBasis[indexOne + 1])) > 0
    ) {
      const temp = decimalBasis[indexOne + 1];
      decimalBasis[indexOne + 1] = decimalBasis[indexOne];
      decimalBasis[indexOne] = temp;
      return LLLProcess(decimalBasis, 0.75, acc);
    }
  }
  acc.push(decimalBasis);
  return acc;
};
