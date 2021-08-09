import Link from 'next/link';
import styles from './header.module.scss';
import common from '../../styles/common.module.scss';

export default function Header(): JSX.Element {
  // TODO!
  return (
    <header className={`${styles.header} `}>
      <div className={common.container}>
        <Link href="/">
          <img src="/logo.svg" alt="logo" />
        </Link>
      </div>
    </header>
  );
}
