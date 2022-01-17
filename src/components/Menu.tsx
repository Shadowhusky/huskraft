// Styles
import "./Menu.scss";

// Utils
import { useState, useEffect } from "react";
import classnames from "classnames";

import { GAME_STATE } from "./GameCanvas";

const prefix = "Menu-";

interface MenuProps {
  gameState: GAME_STATE;
  setGameState: (gameState: GAME_STATE) => void;
}

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

function Menu(props: MenuProps) {
  const { gameState, setGameState } = props;

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener(
      "blur",
      () => {
        if (gameState > 2) setGameState(gameState - 2);
      },
      {
        signal: controller.signal,
      }
    );
    return () => {
      controller.abort();
    };
  }, [gameState, setGameState]);

  const onArcadeButtonClick = () => {
    setGameState(GAME_STATE.RUNNING_ARCADE);
  };

  const onAIButtonClick = () => {
    setGameState(GAME_STATE.RUNNING_AI);
  };

  const onSettingButtonClick = () => {
    // TODO
  };

  const onLastButtonClick = () => {
    if (
      gameState === GAME_STATE.PAUSED_AI ||
      gameState === GAME_STATE.PAUSED_ARCADE
    )
      setGameState(gameState + 2);
    if (gameState === GAME_STATE.LOADING)
      window.open("https://github.com/Shadowhusky/huskraft");
  };

  return (
    <div
      className={classnames(
        prefix + "wrapper",
        gameState < GAME_STATE.PAUSED_AI &&
          gameState !== GAME_STATE.EMPTY &&
          "visible"
      )}
    >
      <MenuItem title="Arcade mode" onClick={onArcadeButtonClick} />
      <MenuItem title="Auto(AI)" onClick={onAIButtonClick} />
      <MenuItem title="Setting" onClick={onSettingButtonClick} />
      <MenuItem
        title={gameState === GAME_STATE.LOADING ? "Github" : "Close"}
        onClick={onLastButtonClick}
      />
    </div>
  );
}

export default Menu;
