# PT: Is there a way to do something similar to java interface where we can make those classes to implement those methods?
from abc import ABC, abstractmethod
from typing import Self

class Exportable(ABC):
    """
    Interface enforcing some methods for the classes in a user's scenario.
    """

    @classmethod
    def from_dict(cls, data) -> Self:
        """Convert a dictionary to an instance of this class."""

    @abstractmethod
    def to_dict(self) -> dict:
        """Convert instance to dictionary representation."""

    @abstractmethod
    def to_yaml(self, path: str):
        """Export as a yaml file to the specific path."""
