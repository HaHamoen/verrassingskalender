<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo">
        <img class="logo-icon" src="/logo.png" alt="Verrassingskalender" />
      </div>

      <nav class="nav-menu">
        <a href="#" class="nav-item">Speluitleg</a>
        <a href="#" class="nav-item">Klantenservice</a>
        <a href="#" class="nav-item"
          >Alle spellen
          <svg
            class="chevron-icon"
            aria-label="Pijl naar beneden"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="m12 12.888 3.9-3.9a.95.95 0 0 1 .7-.276q.425 0 .7.275a.95.95 0 0 1 .275.7.95.95 0 0 1-.275.7l-4.6 4.6q-.3.3-.7.3a.96.96 0 0 1-.7-.3l-4.6-4.6a.95.95 0 0 1-.275-.7q0-.424.275-.7a.95.95 0 0 1 .7-.275q.425 0 .7.275z"
            ></path>
          </svg>
        </a>
      </nav>
    </div>
  </header>
</template>

<style lang="scss" scoped>
  .app-header {
    background: #fff;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
  }

  .header-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    @include green-pattern-background;
    padding: 8px;
    border-radius: 8px;
    display: flex;
    align-items: center;
  }

  .logo-icon {
    height: 55px;
  }

  .nav-menu {
    display: flex;
    gap: 8px;
    align-items: center;

    @media (max-width: 768px) {
      display: none;
    }
  }

  .guesses-counter,
  .cells-counter {
    padding: 10px 20px;
    background: #003084;
    color: white;
    border-radius: 8px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;

    .counter-label {
      font-size: 14px;
    }

    .counter-value {
      font-size: 20px;
      color: #ffd700;
    }
  }

  .nav-item {
    padding: 10px 20px;
    color: #385a9e;
    border-radius: 8px;
    font-weight: 500;
    text-decoration: none;

    .chevron-icon {
      width: 16px;
      height: 16px;
      margin-left: 4px;
      vertical-align: middle;
      fill: #003084;
    }
  }
</style>
