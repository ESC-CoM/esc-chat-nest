export interface LocationDistrict {
  id: number;
  name: string;
}

export interface University {
  id: number;
  name: string;
  campus: string;
  locationDistrict: LocationDistrict;
}

export interface Team {
  id: string;
  title: string;
  representedUniversity: University;
  participants: Participant[];
  maxParticipantNumber: number;
}

export interface Participant {
  id: string;
  profileImageUrl: string;
  nickname: string;
  isOwner: boolean;
  lastAccessed: Date;
}
