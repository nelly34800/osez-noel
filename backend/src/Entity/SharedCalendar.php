<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SharedCalendarRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SharedCalendarRepository::class)]
#[ApiResource]
class SharedCalendar
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $sharedWithEmail = null;

    #[ORM\Column(length: 255)]
    private ?string $token = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(inversedBy: 'yes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?calendar $calendar = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSharedWithEmail(): ?string
    {
        return $this->shared_with_email;
    }

    public function setSharedWithEmail(?string $shared_with_email): static
    {
        $this->shared_with_email = $shared_with_email;

        return $this;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(string $token): static
    {
        $this->token = $token;

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

    public function getCalendar(): ?int
    {
        return $this->calendar;
    }

    public function setCalendar(int $calendar): static
    {
        $this->calendar = $calendar;

        return $this;
    }

    public function getSharedWidthEmail(): ?string
    {
        return $this->shared_width_email;
    }

    public function setSharedWidthEmail(string $shared_width_email): static
    {
        $this->shared_width_email = $shared_width_email;

        return $this;
    }
}
