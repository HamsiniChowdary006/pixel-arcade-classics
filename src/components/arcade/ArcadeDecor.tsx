export function ArcadeDecor() {
  return (
    <div className="arcade-room" aria-hidden="true">
      <div className="room-ceiling" />
      <div className="neon-bar" />
      <div className="neon-tube tube-cyan" />
      <div className="neon-tube tube-pink" />
      <div className="wall-sign">
        <span>PIXEL</span>
        <strong>ARCADE</strong>
      </div>
      <div className="poster p1">
        PLAY
        <br />
        REPEAT
      </div>
      <div className="poster p2">
        GOOD
        <br />
        GAMES
      </div>
      <div className="wall-art art-1">
        INSERT
        <br />
        COIN
      </div>
      <div className="wall-art art-2">
        1UP
        <br />
        00
      </div>
      <div className="room-cabinets">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`mini-cabinet cab-${i}`}>
            <i />
            <b />
          </div>
        ))}
      </div>
      <div className="floor-grid" />
      <div className="floor-reflection reflection-pink" />
      <div className="floor-reflection reflection-cyan" />
      <div className="plant">
        <i />
        <i />
        <i />
      </div>
      <div className="stool stool-left">
        <i />
        <b />
      </div>
      <div className="stool stool-right">
        <i />
        <b />
      </div>
      <div className="pixel-cat">
        ▟█▙
        <br />▀ ▀
      </div>
    </div>
  );
}
