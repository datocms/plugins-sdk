import { TabButton, TabLink, TabList } from '../../navigation/Tabs';
import AddNewButton from './AddNewButton';
import Button from './Button';
import DotsDropdown from './DotsDropdown';
import Fill from './Fill';
import FilterInput from './FilterInput';
import FilterToggle, { useFilterToolbar } from './FilterToggle';
import GoBack from './GoBack';
import Group from './Group';
import Help, { HelpBody } from './Help';
import Note from './Note';
import Pagination from './Pagination';
import PresetsTitle from './PresetsTitle';
import PrimaryButton from './PrimaryButton';
import Root from './Root';
import Search from './Search';
import Space from './Space';
import Spinner from './Spinner';
import Subtitle from './Subtitle';
import TextualDropdown from './TextualDropdown';
import Title from './Title';

const Toolbar = Object.assign(Root, {
  AddNewButton,
  Button,
  FilterInput,
  FilterToggle,
  Fill,
  Search,
  Space,
  DotsDropdown,
  GoBack,
  Group,
  Title,
  PresetsTitle,
  Help,
  HelpBody,
  Note,
  Spinner,
  Pagination,
  PrimaryButton,
  Subtitle,
  Tabs: TabList,
  Tab: TabButton,
  TabLink: TabLink,
  TextualDropdown,
});

export default Toolbar;

export type { ActionItem } from './PrimaryButton';
export { useFilterToolbar };
