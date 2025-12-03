<?php

namespace App\Entity;

use App\Repository\CalendarRepository;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use App\Entity\SharedCalendar;

#[ORM\Entity(repositoryClass: CalendarRepository::class)]
class Calendar
{
    #[ORM\Id]
    #[ORM\Column(type: "uuid")]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: "doctrine.uuid_generator")]
    private ?string $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $slug = null;

    #[ORM\Column (type: 'json')]
    private array $settings = [];

    #[ORM\Column (type: 'json')]
    private array $days = [];

    #[ORM\Column]
    private ?DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(inversedBy: 'calendars')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\OneToMany(targetEntity: SharedCalendar::class, mappedBy: 'calendar', orphanRemoval: true)]
    private Collection $sharedCalendars;

    public function __construct()
    {
        $this->sharedCalendars = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;
        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;
        return $this;
    }

    public function getSettings(): array
    {
        return $this->settings;
    }

    public function setSettings(array $settings): static
    {
        $this->settings = $settings;
        return $this;
    }

    public function getDays(): array
    {
        return $this->days;
    }

    public function setDays(array $days): static
    {
        $this->days = $days;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;
        return $this;
    }

    /**
     * @return Collection<int, SharedCalendar>
     */
    public function getSharedCalendars(): Collection
    {
        return $this->sharedCalendars;
    }

    public function addSharedCalendar(SharedCalendar $sharedCalendar): static
    {
        if (!$this->sharedCalendars->contains($sharedCalendar)) {
            $this->sharedCalendars->add($sharedCalendar);
            $sharedCalendar->setCalendar($this);
        }

        return $this;
    }

    public function removeSharedCalendar(SharedCalendar $sharedCalendar): static
    {
        if ($this->sharedCalendars->removeElement($sharedCalendar)) {
            if ($sharedCalendar->getCalendar() === $this) {
                $sharedCalendar->setCalendar(null);
            }
        }

        return $this;
    }
}
