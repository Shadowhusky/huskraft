// Styles
import "./Menu.scss";

// Utils
import { useState, useEffect } from "react";

const prefix = "Menu-";

function MenuItem(props) {
  const { title, onClick, visible } = props;
  return (
    <div
      className={prefix + "menuItem-wrapper"}
      onClick={onClick}
      style={{ visibility: visible !== false ? "visible" : "hidden" }}
    >
      <span>{title}</span>
    </div>
  );
}

function Menu(props) {
  const { gameState, setGameState } = props;

  useEffect(() => {
    const onBlur = window.addEventListener("blur", () => {
      if (gameState > 2) setGameState(gameState - 2);
    });
    return () => {
      window.removeEventListener("blur", onBlur);
    };
  }, [gameState, setGameState]);

  const onArcadeButtonClick = () => {
    setGameState(3);
  };

  const onAIButtonClick = () => {
    setGameState(4);
  };

  const onSettingButtonClick = () => {
    // TODO
  };

  const onLastButtonClick = () => {
    if (gameState === 1 || gameState === 2) setGameState(gameState + 2);
  };

  return (
    <div
      className={prefix + "wrapper"}
      style={{ opacity: gameState < 3 ? 1 : 0 }}
    >
      <MenuItem title="Arcade mode" onClick={onArcadeButtonClick} />
      <MenuItem title="Auto(AI)" onClick={onAIButtonClick} />
      <MenuItem title="Setting" onClick={onSettingButtonClick} />
      <MenuItem
        title={gameState === 0 ? "Github" : "Close"}
        onClick={onLastButtonClick}
      />
    </div>
  );
}

export default Menu;
