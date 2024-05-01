import user from "../../assets/user.png";

const User = () => {
  return (
    <figure className="user-left-prev">
      <img src={user} alt="" />

      <figcaption className="">
        <h2 className="line-1-column">Cilli Balam Elya</h2>
        <h3 className="line-1-column">Ich libe dich &#60;3 </h3>
      </figcaption>
    </figure>
  );
};

export default User;
