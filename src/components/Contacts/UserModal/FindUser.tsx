import React from "react";
import ResultUser from "./ResultUser";

interface Props {
  close: () => void;
}

const FindUser: React.FC<Props> = ({ close }) => {
  const stopClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  return (
    <div onClick={close} className="find-user-modal">
      <div onClick={stopClick} className="inner-user-modal">
        <form>
          <input type="text" placeholder="Username" />
          <button>Search</button>
        </form>

        <section className="search-result">
          <ResultUser />
          <ResultUser />
          <ResultUser />
          <ResultUser />
          <ResultUser />
          <ResultUser />
        </section>
      </div>
    </div>
  );
};

export default FindUser;
