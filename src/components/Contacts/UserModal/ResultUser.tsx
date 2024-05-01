import user from "../../../assets/user.png";


const ResultUser = () => {
  return (
    <figure className="result-user">
      <img
        src={user}
        alt=""
      />

      <figcaption className="result-user-description">
        <h3>Name</h3>
        <button>Add</button>
      </figcaption>
    </figure>
  );
};

export default ResultUser;
