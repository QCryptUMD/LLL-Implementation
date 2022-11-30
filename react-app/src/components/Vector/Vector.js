import styles from "./Vector.module.css";

const Vector = ({ array }) => {
  return (
    <div className={styles.container}>
      <div className={styles.verticalBorders}>
        <div className={styles.verticalLeftBorder}></div>
        <div className={styles.verticalRightBorder}></div>
      </div>
      <div className={styles.vectorBorder}>
        {array.map((ele) => {
          return <div className={styles.individualElement}>{ele}</div>;
        })}
      </div>
      <div className={styles.verticalBorders}>
        <div className={styles.verticalLeftBorder}></div>
        <div className={styles.verticalRightBorder}></div>
      </div>
    </div>
  );
};

export default Vector;
