import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  ArcadeSettings,
  GameEngine,
  GameId,
  GameSnapshot,
  Screen,
  SfxName,
} from "../../arcade/types";
import { GAME_META } from "../../arcade/types";
import { ArcadeAudio } from "../../arcade/audio";
import { defaults, loadSettings, saveSettings } from "../../arcade/storage";
import { PixelButton } from "./PixelButton";
import { ArcadeDecor } from "./ArcadeDecor";
import { GameCanvas } from "./GameCanvas";
const ids = Object.keys(GAME_META) as GameId[];
type Session = { username: string; game: GameId; snapshot: GameSnapshot };
export function ArcadeApp() {
  const [screen, setScreen] = useState<Screen>("home"),
    [game, setGame] = useState<GameId>("pinball"),
    [selected, setSelected] = useState(0),
    [settings, setSettings] = useState<ArcadeSettings>(defaults),
    [hydrated, setHydrated] = useState(false),
    [paused, setPaused] = useState(false),
    [snapshot, setSnapshot] = useState<GameSnapshot>({ score: 0 }),
    [finalScore, setFinalScore] = useState<number | null>(null),
    [username, setUsername] = useState("PLAYER"),
    [session, setSession] = useState<Session | null>(null),
    [settingsReturn, setSettingsReturn] = useState<Screen>("home"),
    [run, setRun] = useState(0);
  const engineRef = useRef<GameEngine | null>(null);
  const snapshotRef = useRef<GameSnapshot>({ score: 0 });
  const audio = useMemo(() => new ArcadeAudio(settings), []);
  useEffect(() => {
    setSettings(loadSettings());
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    saveSettings(settings);
    audio.setSettings(settings);
  }, [settings, hydrated, audio]);
  const sound = (n: Parameters<ArcadeAudio["play"]>[0]) => audio.play(n);
  const go = (s: Screen) => {
    sound("select");
    setScreen(s);
  };
  const launch = (id: GameId) => {
    setGame(id);
    setUsername("PLAYER");
    go("setup");
  };
  const startGame = () => {
    const name = username.trim().slice(0, 12).toUpperCase() || "PLAYER";
    setUsername(name);
    snapshotRef.current = { score: 0 };
    setSnapshot(snapshotRef.current);
    setFinalScore(null);
    setPaused(false);
    setRun((v) => v + 1);
    go("game");
  };
  const over = useCallback(
    (v: number) => {
      sound("over");
      setSession({ username, game, snapshot: { ...snapshotRef.current, score: v } });
      setFinalScore(v);
      setScreen("card");
    },
    [game, username],
  );
  const updateSnapshot = (value: GameSnapshot) => {
    snapshotRef.current = value;
    setSnapshot(value);
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.code === "KeyM") {
        setSettings((v) => ({ ...v, muted: !v.muted }));
        return;
      }
      if (e.code === "KeyP" && screen === "game" && !finalScore) {
        setPaused((v) => !v);
        return;
      }
      if (e.code === "Escape") {
        if (finalScore) {
          setFinalScore(null);
          setScreen("card");
        } else if (paused) setPaused(false);
        else if (screen !== "home") setScreen(screen === "game" ? "select" : "home");
      }
      if (screen === "select") {
        if (e.code === "ArrowLeft") setSelected((v) => (v + 3) % 4);
        if (e.code === "ArrowRight") setSelected((v) => (v + 1) % 4);
        if (e.code === "Enter") launch(ids[selected] ?? "pinball");
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [screen, selected, paused, finalScore]);
  const content = () => {
    if (screen === "home")
      return (
        <Home
          onPlay={() => go("select")}
          onScores={() => go("card")}
          onSettings={() => {
            setSettingsReturn("home");
            go("settings");
          }}
          onCoin={() => {
            audio.startMusic();
            sound("coin");
          }}
        />
      );
    if (screen === "select")
      return <Select selected={selected} setSelected={setSelected} launch={launch} />;
    if (screen === "setup")
      return (
        <PlayerSetup
          game={game}
          username={username}
          setUsername={setUsername}
          start={startGame}
          back={() => go("select")}
        />
      );
    if (screen === "card")
      return (
        <ScoreCard
          session={session}
          playAgain={() => launch(game)}
          changeGame={() => go("select")}
          arcade={() => go("home")}
        />
      );
    if (screen === "settings")
      return (
        <Settings
          value={settings}
          setValue={setSettings}
          back={() => go(settingsReturn)}
          controls={() => go("controls")}
        />
      );
    if (screen === "controls") return <Controls back={() => go("settings")} />;
    return (
      <Game
        game={game}
        snapshot={snapshot}
        setSnapshot={setSnapshot}
        paused={paused}
        setPaused={setPaused}
        username={username}
        updateSnapshot={updateSnapshot}
        restart={() => {
          setFinalScore(null);
          setPaused(false);
          setRun((v) => v + 1);
        }}
        settings={() => {
          setPaused(false);
          setSettingsReturn("game");
          go("settings");
        }}
        exit={() => {
          setFinalScore(null);
          setPaused(false);
          go("select");
        }}
        sound={sound}
        engineRef={engineRef}
        over={over}
        run={run}
      />
    );
  };
  return (
    <main
      className={`pixel-arcade ${settings.crt ? "crt-on" : ""}`}
      onPointerDown={() => audio.unlock()}
    >
      <div className="screen-shell">
        <header>
          <span className="brand-small">PIXEL ARCADE</span>
          <span className="status">
            CREDITS 03&nbsp;&nbsp; {settings.muted ? "MUTED" : "SOUND ON"}
          </span>
        </header>
        {content()}
        <div className="scanlines" />
      </div>
    </main>
  );
}
function Home({
  onPlay,
  onScores,
  onSettings,
  onCoin,
}: {
  onPlay: () => void;
  onScores: () => void;
  onSettings: () => void;
  onCoin: () => void;
}) {
  return (
    <section className="home-screen">
      <ArcadeDecor />
      <div className="home-menu">
        <div className="logo">
          <span>PIXEL</span>
          <strong>ARCADE</strong>
        </div>
        <button className="insert" onClick={onCoin}>
          INSERT COIN ◉
        </button>
        <PixelButton autoFocus onClick={onPlay}>
          ▶ PLAY
        </PixelButton>
        <PixelButton onClick={onScores}>▣ SCORE CARD</PixelButton>
        <PixelButton onClick={onSettings}>⚙ SETTINGS</PixelButton>
        <PixelButton onClick={() => document.documentElement.requestFullscreen?.()}>
          ⛶ FULLSCREEN
        </PixelButton>
      </div>
    </section>
  );
}
function Cabinet({ id, active, onClick }: { id: GameId; active: boolean; onClick: () => void }) {
  const m = GAME_META[id];
  return (
    <button className={`cabinet accent-${m.accent} ${active ? "selected" : ""}`} onClick={onClick}>
      <span className="selector">▼</span>
      <h2>{m.title}</h2>
      <div className={`cabinet-screen preview-${id}`}>
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="cabinet-controls">● ● ◉</div>
      <p>
        {m.subtitle}
        <br />
        <b>1 PLAYER</b>
      </p>
    </button>
  );
}
function Select({
  selected,
  setSelected,
  launch,
}: {
  selected: number;
  setSelected: (n: number) => void;
  launch: (g: GameId) => void;
}) {
  return (
    <section className="menu-screen select-screen">
      <ArcadeDecor />
      <h1>SELECT YOUR MACHINE</h1>
      <div className="cabinet-grid">
        {ids.map((id, i) => (
          <Cabinet
            key={id}
            id={id}
            active={i === selected}
            onClick={() => {
              setSelected(i);
              launch(id);
            }}
          />
        ))}
      </div>
      <p className="key-help">← → SELECT &nbsp; • &nbsp; ENTER PLAY &nbsp; • &nbsp; ESC BACK</p>
    </section>
  );
}
function PlayerSetup({
  game,
  username,
  setUsername,
  start,
  back,
}: {
  game: GameId;
  username: string;
  setUsername: (value: string) => void;
  start: () => void;
  back: () => void;
}) {
  return (
    <section className="menu-screen panel-screen">
      <h1>PLAYER SETUP</h1>
      <p className="setup-game">{GAME_META[game].title}</p>
      <label className="username-label" htmlFor="username">
        ENTER USERNAME
      </label>
      <input
        id="username"
        className="initials username-input"
        maxLength={12}
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value.replace(/[^a-z0-9 ]/gi, "").toUpperCase())}
        onKeyDown={(e) => {
          if (e.key === "Enter") start();
        }}
      />
      <div className="row">
        <PixelButton onClick={start}>▶ START GAME</PixelButton>
        <PixelButton onClick={back}>← BACK</PixelButton>
      </div>
    </section>
  );
}
function ScoreCard({
  session,
  playAgain,
  changeGame,
  arcade,
}: {
  session: Session | null;
  playAgain: () => void;
  changeGame: () => void;
  arcade: () => void;
}) {
  const stats = session?.snapshot;
  const rows =
    session?.game === "pinball"
      ? [
          ["BALLS USED", stats?.ballsUsed ?? stats?.ball ?? 0],
          ["BEST COMBO", `x${stats?.bestCombo ?? stats?.combo ?? 1}`],
          ["TARGETS HIT", stats?.targetsHit ?? 0],
        ]
      : session?.game === "galaga"
        ? [
            ["WAVE REACHED", stats?.wave ?? 1],
            ["ENEMIES DEFEATED", stats?.enemiesDefeated ?? 0],
            ["LIVES REMAINING", stats?.lives ?? 0],
          ]
        : session?.game === "pacman"
          ? [
              ["LEVEL REACHED", stats?.level ?? 1],
              ["PELLETS COLLECTED", stats?.pelletsCollected ?? 0],
              ["ENEMIES DEFEATED", stats?.enemiesDefeated ?? 0],
            ]
          : [
              ["LEVEL", stats?.level ?? 1],
              ["LINES CLEARED", stats?.lines ?? 0],
              ["PIECES PLACED", stats?.piecesPlaced ?? 0],
            ];
  return (
    <section className="menu-screen panel-screen score-card">
      <h1>SCORE CARD</h1>
      {!session ? (
        <p className="empty-card">NO SESSION COMPLETE</p>
      ) : (
        <>
          <div className="score-card-main">
            <span>PLAYER</span>
            <strong>{session.username}</strong>
            <span>GAME</span>
            <strong>{GAME_META[session.game].title}</strong>
            <span>SCORE</span>
            <strong>{String(stats?.score ?? 0).padStart(6, "0")}</strong>
          </div>
          <div className="score-card-stats">
            {rows.map(([label, value]) => (
              <p key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </p>
            ))}
          </div>
          <p className="session-complete">SESSION COMPLETE</p>
          <PixelButton autoFocus onClick={playAgain}>
            ↻ PLAY AGAIN
          </PixelButton>
          <PixelButton onClick={changeGame}>▣ CHANGE GAME</PixelButton>
        </>
      )}
      <PixelButton onClick={arcade}>⌂ ARCADE</PixelButton>
    </section>
  );
}
function Settings({
  value,
  setValue,
  back,
  controls,
}: {
  value: ArcadeSettings;
  setValue: (v: ArcadeSettings) => void;
  back: () => void;
  controls: () => void;
}) {
  const row = (label: keyof ArcadeSettings) => (
    <div className="setting-row">
      <span>{label.toUpperCase()}</span>
      {typeof value[label] === "number" ? (
        <input
          aria-label={label}
          type="range"
          min="0"
          max="100"
          value={value[label] as number}
          onChange={(e) => setValue({ ...value, [label]: +e.target.value })}
        />
      ) : (
        <PixelButton onClick={() => setValue({ ...value, [label]: !value[label] })}>
          {value[label] ? "ON" : "OFF"}
        </PixelButton>
      )}
    </div>
  );
  return (
    <section className="menu-screen panel-screen">
      <h1>SETTINGS</h1>
      <div className="settings-box">
        {row("music")}
        {row("sfx")}
        {row("crt")}
        <div className="setting-row">
          <span>FULLSCREEN</span>
          <PixelButton
            onClick={() =>
              document.fullscreenElement
                ? document.exitFullscreen()
                : document.documentElement.requestFullscreen()
            }
          >
            TOGGLE
          </PixelButton>
        </div>
      </div>
      <div className="row">
        <PixelButton onClick={controls}>CONTROLS</PixelButton>
        <PixelButton onClick={back}>← BACK</PixelButton>
      </div>
    </section>
  );
}
function Controls({ back }: { back: () => void }) {
  return (
    <section className="menu-screen panel-screen">
      <h1>CONTROLS</h1>
      <div className="controls-list">
        {ids.map((id) => (
          <article key={id}>
            <h2>{GAME_META[id].title}</h2>
            {GAME_META[id].controls.map((c) => (
              <p key={c}>{c}</p>
            ))}
          </article>
        ))}
      </div>
      <p>P PAUSE &nbsp; M MUTE &nbsp; ESC BACK</p>
      <PixelButton onClick={back}>← BACK</PixelButton>
    </section>
  );
}
function Game({
  game,
  snapshot,
  setSnapshot,
  paused,
  setPaused,
  username,
  updateSnapshot,
  restart,
  settings,
  exit,
  sound,
  engineRef,
  over,
  run,
}: {
  game: GameId;
  snapshot: GameSnapshot;
  setSnapshot: (v: GameSnapshot) => void;
  paused: boolean;
  setPaused: (v: boolean) => void;
  username: string;
  updateSnapshot: (value: GameSnapshot) => void;
  restart: () => void;
  settings: () => void;
  exit: () => void;
  sound: (n: SfxName) => void;
  engineRef: React.MutableRefObject<GameEngine | null>;
  over: (n: number) => void;
  run: number;
}) {
  const m = GAME_META[game];
  const touchMap =
    game === "pinball"
      ? ["KeyA", "Space", "KeyD"]
      : game === "galaga"
        ? ["ArrowLeft", "Space", "ArrowRight"]
        : game === "pacman"
          ? ["ArrowLeft", "ArrowUp", "ArrowRight"]
          : ["ArrowLeft", "Space", "ArrowRight"];
  const touchLabel = (code: string, index: number) => {
    if (index === 0) return "←";
    if (index === 2) return "→";
    if (code === "Space") return "FIRE";
    return code === "ArrowUp" ? "▲" : "●";
  };
  return (
    <section className={`game-screen accent-${m.accent}`}>
      <div className="hud">
        <div>
          <small>{m.title}</small>
          <strong>SCORE {String(snapshot.score || 0).padStart(6, "0")}</strong>
        </div>
        {snapshot.ball !== undefined && (
          <span>
            BALL {String(snapshot.ball).padStart(2, "0")}
            <br />
            COMBO x{snapshot.combo}
          </span>
        )}
        {snapshot.lives !== undefined && (
          <span>
            LIVES {snapshot.lives}
            <br />
            {snapshot.wave ? `WAVE ${snapshot.wave}` : `LEVEL ${snapshot.level}`}
          </span>
        )}
        {snapshot.lines !== undefined && (
          <span>
            LEVEL {snapshot.level}
            <br />
            LINES {snapshot.lines}
          </span>
        )}
        <span>PLAYER {username}</span>
      </div>
      <div className="play-layout">
        <div className="canvas-frame">
          <GameCanvas
            key={`${game}-${run}`}
            game={game}
            paused={paused}
            engineRef={engineRef}
            hooks={{ update: updateSnapshot, gameOver: over, sfx: sound }}
          />
        </div>
        <aside>
          <h3>CONTROLS</h3>
          {m.controls.map((c) => (
            <p key={c}>{c}</p>
          ))}
          <p>
            P PAUSE
            <br />M MUTE
            <br />
            ESC EXIT
          </p>
          {game === "tetris" && (
            <>
              <h3>NEXT</h3>
              <div className="piece-name">{snapshot.next}</div>
              <h3>HOLD</h3>
              <div className="piece-name">{snapshot.hold || "—"}</div>
            </>
          )}
        </aside>
      </div>
      <div className="touch-controls">
        {touchMap.map((code, index) => (
          <PixelButton
            key={code}
            onPointerDown={() => engineRef.current?.key(code, true)}
            onPointerUp={() => engineRef.current?.key(code, false)}
            onPointerCancel={() => engineRef.current?.key(code, false)}
          >
            {touchLabel(code, index)}
          </PixelButton>
        ))}
      </div>
      {paused && (
        <Overlay title="GAME PAUSED">
          <PixelButton autoFocus onClick={() => setPaused(false)}>
            ▶ RESUME
          </PixelButton>
          <PixelButton onClick={restart}>↻ RESTART</PixelButton>
          <PixelButton onClick={settings}>⚙ SETTINGS</PixelButton>
          <PixelButton onClick={exit}>EXIT TO ARCADE</PixelButton>
        </Overlay>
      )}
    </section>
  );
}
function Overlay({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overlay">
      <div className="overlay-box">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
