const Footer: React.FC = () => {
  return (
    <footer className="text-center leading-[50px]">
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - All right reserved by ACME
          Industries Ltd
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
