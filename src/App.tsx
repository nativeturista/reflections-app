import { useState, useRef, useEffect } from "react";
import type { CSSProperties } from "react";

const C = {
  surface: "#0D1B2A",
  card: "#111f2e",
  border: "rgba(63,182,139,0.18)",
  green: "#3FB68B",
  sand: "#F5F2EB",
  yellow: "#F6C90E",
  muted: "rgba(245,242,235,0.45)",
};

interface IntakeQuestion { id: string; q: string; opts: string[]; }
interface Choice { first: string; second: string | null; }
interface Message { role: "user" | "assistant"; content: string; }
interface Profile { role: string; disconnect: string; anchor: string; wound: string; seeking: string; [key: string]: string; }
interface Reflection { text: string; tags: string[]; }

// ─── 100 REFLECTIONS ────────────────────────────────────────────────────────
// Voices: Bashar · April Elizabeth · Wendy Kennedy · Kryon
// Tagged by theme for intelligent matching

const REFLECTIONS: Reflection[] = [
  // PURPOSE & DIRECTION
  { text: "You already know this: your purpose is not something you find — it is something you remember. The excitement you feel in quiet moments? That is not random. That is your frequency showing you the path. What makes you feel most alive right now?", tags: ["purpose", "seeking", "direction", "clarity"] },
  { text: "Dear one, you did not come here to figure it out. You came here to be it. The very confusion you feel is the contraction before expansion. What if the question itself is the doorway?", tags: ["purpose", "confusion", "direction", "kryon"] },
  { text: "From our perspective, you have never been lost. You have been gathering. Every experience you've called a detour was actually a direct route to the version of you that knows. What have you gathered that you haven't yet valued?", tags: ["purpose", "wendy", "trust", "direction"] },
  { text: "You already know this: your highest excitement — however small it seems — is the compass. Not the destination. Not the plan. The excitement IS the path. What lights something up in you that you keep dismissing as too small?", tags: ["purpose", "bashar", "excitement", "direction"] },
  { text: "There is a version of you in a parallel reality who chose this exact feeling as the moment everything shifted. You are already that version. What would they do today that you keep postponing?", tags: ["purpose", "bashar", "parallel", "action"] },

  // WORTHINESS & ENOUGH
  { text: "You already know this: you do not earn your worth. You remember it. The striving, the proving — those are beautiful human patterns, but they were never the source. You were whole before you took your first breath here. What would you do today if you already knew you were enough?", tags: ["worthy", "enough", "achiever", "overworking"] },
  { text: "Dear one, your value is not a result. It is not something you build or lose. It is the very thing you are made of. The cells in your body do not earn their right to exist — they simply are. You are that. What would rest feel like if it were not a reward?", tags: ["worthy", "rest", "kryon", "overworking"] },
  { text: "Notice this: the part of you that seeks approval is the youngest part of you — not the wisest. Your wisdom already knows the answer. What does the wisest version of you want to say to the part that is still asking for permission?", tags: ["worthy", "approval", "approval-seeking", "approval"] },
  { text: "From our perspective, every lifetime you've lived has been building the frequency you carry right now. You are not behind. You are not lacking. You are the accumulation of extraordinary experience. Can you feel the weight of what you've already survived and grown through?", tags: ["worthy", "wendy", "enough", "trust"] },
  { text: "You already know this: the feeling that something is wrong with you is not the truth — it is a frequency you inherited. It was never yours. What belief about yourself would you release today if you knew you were allowed to?", tags: ["worthy", "wound", "patterns", "release"] },

  // LONELINESS & CONNECTION
  { text: "You already know this: the loneliness you feel is not the absence of others — it is the distance between you and yourself. The moment you return to you, you will find the connection you have been searching for everywhere else. What part of yourself have you been avoiding?", tags: ["lonely", "connection", "disconnect", "self"] },
  { text: "Dear one, you have never been alone. Not for a single moment. What you call loneliness is simply the forgetting. And forgetting is part of the human design — so that remembering becomes the most profound experience possible. What does it feel like when you truly remember you are not alone?", tags: ["lonely", "kryon", "connection", "remember"] },
  { text: "The ache you feel is not emptiness. It is depth. Only beings capable of great love feel loneliness that deeply. Your capacity to feel this is the same capacity that makes you extraordinary. What would it mean if your depth were a gift rather than a wound?", tags: ["lonely", "depth", "sensitivity", "invisible"] },
  { text: "From our perspective, every being you have ever loved is still woven into your energy field. Connection does not end — it transforms. Who in your life, present or past, do you feel most tethered to without knowing why?", tags: ["lonely", "wendy", "connection", "energy"] },
  { text: "You already know this: you were not meant to need no one. You were meant to choose connection from wholeness instead of fear. The difference is everything. What would choosing connection from your fullest self look like right now?", tags: ["lonely", "connection", "fear", "choose"] },

  // PATTERNS & REPEATING CYCLES
  { text: "You already know this: the pattern repeats not to punish you — but because it contains something you have not yet received from it. What gift might this pattern be trying to give you that you have been too frustrated to unwrap?", tags: ["pattern", "wound", "cycle", "repeat"] },
  { text: "Notice this: the version of the pattern you are experiencing now is quieter than the first time. You are not going backward. You are seeing it with new eyes. What do you see this time that you could not see before?", tags: ["pattern", "growth", "cycle", "wound"] },
  { text: "Dear one, your patterns are not proof that something is broken. They are the grooves worn by old beliefs that once kept you safe. Compassion for the pattern dissolves it faster than resistance ever could. Can you find even a thread of gratitude for what this pattern once protected you from?", tags: ["pattern", "kryon", "compassion", "wound", "peacemaker"] },
  { text: "From our perspective, this pattern exists in your field as an unresolved frequency — not a flaw. You chose to come back to it because you are ready. Not because you failed. What does ready feel like in your body right now?", tags: ["pattern", "wendy", "wound", "frequency", "ready"] },
  { text: "You already know this: the moment you stop fighting the pattern and get curious about it, everything shifts. Resistance keeps it in place. Curiosity creates space. What are you most curious about this pattern that you haven't let yourself ask yet?", tags: ["pattern", "curious", "shift", "wound", "cycle"] },

  // FEAR & UNCERTAINTY
  { text: "You already know this: fear is not a stop sign — it is a sign that you are standing at the edge of your known world. Every version of you that has ever grown has felt exactly this feeling right before. What is just on the other side of this fear?", tags: ["fear", "uncertainty", "growth", "edge"] },
  { text: "Notice this: the mind creates certainty as a comfort, not as a truth. Uncertainty is actually the most honest state there is — it means you are present in the only moment that exists. What becomes possible when you release the need to know what comes next?", tags: ["fear", "uncertainty", "present", "mind"] },
  { text: "Dear one, you have walked into the unknown before. You did not have a map then either. And here you are. What did past-you figure out that current-you has forgotten about your own resilience?", tags: ["fear", "unknown", "kryon", "resilience", "trust"] },
  { text: "From our perspective, the timeline you are most afraid of does not have to be the one you choose. Every decision point is a branching. You have more agency than your fear is showing you right now. What decision feels most aligned with the version of you you want to become?", tags: ["fear", "wendy", "choice", "timeline", "agency"] },
  { text: "You already know this: your nervous system was built for a world that no longer fully exists. The alarm you feel is old data. Real, but old. Can you breathe into the part of you that knows — not the part that fears?", tags: ["fear", "body", "nervous", "bashar", "breathe"] },

  // SELF-SABOTAGE
  { text: "You already know this: self-sabotage is just self-protection wearing the wrong clothes. Some part of you believes that getting what you want is more dangerous than not having it. What would you have to believe about yourself for success to feel safe?", tags: ["sabotage", "wound", "protection", "worthy"] },
  { text: "Notice this: the moment things start going well, something in you braces for the fall. That brace is not weakness — it is a belief that joy has a cost. What if it didn't? What if you were allowed to have this?", tags: ["sabotage", "joy", "allowed", "wound"] },
  { text: "Dear one, you learned to stop yourself before others could stop you. That was intelligent then. It kept something safe. But you are not in that place anymore. The one who needed that protection — can you thank them and gently tell them they can rest now?", tags: ["sabotage", "kryon", "inner child", "wound", "protection"] },
  { text: "From our perspective, what you call self-sabotage is actually the old frequency asserting itself at the moment your new frequency becomes available. It is a test of resonance, not a failure of will. Which frequency feels more like the real you?", tags: ["sabotage", "wendy", "frequency", "wound"] },
  { text: "You already know this: the ceiling you keep hitting is not the world's limit — it is the edge of your current belief about what you deserve. What would you need to believe about yourself to walk through that ceiling instead of turning back?", tags: ["sabotage", "worthy", "ceiling", "believe", "deserving"] },

  // PEOPLE PLEASING & BOUNDARIES
  { text: "You already know this: saying yes when you mean no is not kindness — it is a slow erosion of the self. Every time you choose yourself, you teach others how much of you is real. What would you say today if you trusted that you would still be loved after saying it?", tags: ["boundaries", "yes", "wound", "pleasing", "caretaker", "peacemaker"] },
  { text: "Notice this: the exhaustion you feel is not from doing too much — it is from abandoning yourself too many times in a row. What would you need to reclaim for yourself this week that you have been giving away?", tags: ["boundaries", "exhaustion", "caretaker", "wound"] },
  { text: "Dear one, you chose care as your superpower because it is real and it is yours. But care was never meant to flow in only one direction. What would it feel like to receive care as fully as you give it?", tags: ["boundaries", "caretaker", "receive", "kryon", "wound"] },
  { text: "From our perspective, every boundary is an act of love — for yourself and for the other. When you say no, you give them the gift of the truth. The version of you that people truly love is not the one who never says no. What truth are you ready to speak?", tags: ["boundaries", "wendy", "no", "love", "truth"] },
  { text: "You already know this: the people who truly belong in your life will not leave when you show them where you end. The ones who leave at the boundary were only there for access, not for you. What boundary have you been postponing that your body already knows is right?", tags: ["boundaries", "wound", "pleasing", "belong"] },

  // RELATIONSHIPS
  { text: "You already know this: you cannot save someone who has not yet chosen to save themselves. Love does not require self-erasure. The greatest thing you can offer is your wholeness, not your sacrifice. What part of yourself have you been giving away in this relationship?", tags: ["relationship", "love", "sacrifice", "wound", "caretaker"] },
  { text: "Notice this: the conflict you are feeling with another person is always — always — a conversation your soul is trying to have with itself. What is this relationship showing you about you, not about them?", tags: ["relationship", "conflict", "mirror", "soul"] },
  { text: "Dear one, the love you seek from another is the love you are still learning to give yourself. This is not a disappointment — it is a direction. What would you say to yourself if you spoke to yourself the way you wish they would speak to you?", tags: ["relationship", "love", "self", "kryon", "wound"] },
  { text: "From our perspective, every significant relationship in your life was chosen before you arrived here — not as a guarantee, but as an invitation. What is the deepest invitation this relationship is extending to you?", tags: ["relationship", "wendy", "soul contract", "invitation"] },
  { text: "You already know this: the right connections do not require you to disappear inside them. They require you to show up fully. What would showing up fully — not performing, not managing — feel like in your most important relationship right now?", tags: ["relationship", "authentic", "showing up", "love"] },

  // REST & PERMISSION
  { text: "You already know this: rest is not a reward for finishing. It is a requirement for being. Your nervous system is not lazy — it is asking for what it needs to function as the extraordinary instrument it is. What would rest look like if it were not earned?", tags: ["rest", "permission", "worthy", "body"] },
  { text: "Notice this: the busyness you fill your life with is sometimes a way of not having to feel what is underneath. What is waiting for you in the stillness that you keep moving to avoid?", tags: ["rest", "stillness", "feel", "avoid", "overwhelm"] },
  { text: "Dear one, you were not put here to be productive. You were put here to be alive. The universe does not measure your worth in output. What would a day feel like if you allowed it to be enough just to exist in it?", tags: ["rest", "kryon", "permission", "worthy", "enough"] },
  { text: "From our perspective, when you stop — truly stop — you begin to receive the transmissions that only come in the quiet. Rest is not the absence of creation. It is where creation originates. What have you been too busy to receive?", tags: ["rest", "wendy", "receive", "stillness", "creative"] },
  { text: "You already know this: the version of you that keeps pushing past empty is not strong — they are afraid. Afraid that if they stop, they will fall behind or be forgotten. What would be true about you if you stopped, and found out you were still here, still enough?", tags: ["rest", "fear", "stop", "enough", "overworking"] },

  // IDENTITY & ROLES
  { text: "You already know this: the role you played in your family was a costume — a brilliant adaptation. But you are not the costume. Who are you when no one needs anything from you and there is nothing to hold together?", tags: ["identity", "role", "family", "peacemaker", "caretaker"] },
  { text: "Notice this: the label you give yourself is always smaller than what you actually are. Every time you say 'I am the kind of person who...' — notice if you are describing a truth or a cage. Which parts of your self-description are actually just habits?", tags: ["identity", "label", "cage", "role"] },
  { text: "Dear one, in the quantum field, you are not one fixed self. You are a vast spectrum of possibility choosing a focus. The self you most identify with is beloved — but it is not all of you. What version of yourself have you been afraid to let anyone see?", tags: ["identity", "kryon", "quantum", "self", "spectrum"] },
  { text: "From our perspective, you have lived many lives wearing many faces. This one is your most complex and your most powerful. What qualities do you carry in this life that feel ancient — like you have always had them?", tags: ["identity", "wendy", "past lives", "ancient", "soul"] },
  { text: "You already know this: the invisible one is not unseen — they are watching. Gathering. Understanding everything while appearing to need nothing. What has the invisible vantage point taught you that the people in the spotlight do not yet know?", tags: ["identity", "invisible", "role", "family", "observer"] },

  // CLARITY & DECISIONS
  { text: "You already know this: the decision you are agonizing over has already been made by the part of you that knows. The mind is just catching up. When you get very quiet, which choice does your body move toward?", tags: ["clarity", "decision", "body", "know", "seeking"] },
  { text: "Notice this: when a choice is right for you, it feels like relief — even if it is also frightening. Fear and rightness can coexist. What decision, if you made it, would let you exhale?", tags: ["clarity", "decision", "relief", "right", "exhale"] },
  { text: "Dear one, you do not need more information. You need more trust. The data you are waiting for is already inside you. What do you already know that you are pretending you don't?", tags: ["clarity", "trust", "know", "kryon", "decision"] },
  { text: "From our perspective, there are no wrong choices — only different experiences that lead back to the same essential truth of who you are. What would you choose if you trusted that you could not get this wrong?", tags: ["clarity", "wendy", "wrong", "choice", "trust"] },
  { text: "You already know this: the clarity you seek is not about knowing the outcome — it is about trusting yourself to handle whatever comes. What do you know about your own ability to navigate that you are currently underestimating?", tags: ["clarity", "trust", "outcome", "self", "navigate"] },

  // CREATIVITY & FLOW
  { text: "You already know this: creative flow is your natural state. The resistance you feel is not the absence of creativity — it is the presence of judgment. What would you make today if no one, including you, would ever evaluate it?", tags: ["creative", "flow", "resistance", "judgment", "anchor"] },
  { text: "Notice this: the thing you make when you are not trying to make anything good is usually the truest thing. The self-consciousness is the interference. What has been trying to come through you that you keep editing before it arrives?", tags: ["creative", "flow", "true", "self-conscious"] },
  { text: "Dear one, creativity is not a talent. It is a frequency. And your frequency is always available. What you call 'being blocked' is simply being tuned to a different station temporarily. What would help you tune back?", tags: ["creative", "kryon", "frequency", "blocked", "flow"] },
  { text: "From our perspective, every creative impulse you have ever had came from a dimension beyond this one. You are a receiver, not just a creator. What impulse have you been dismissing as too strange or too big?", tags: ["creative", "wendy", "receive", "impulse", "dimension"] },
  { text: "You already know this: your most powerful creative act is the life you are building — not just the things you make within it. Every choice is a brushstroke. What does the painting you are making with your life look like right now, and what would you add?", tags: ["creative", "life", "choice", "building", "purpose"] },

  // GRIEF & LOSS
  { text: "You already know this: grief is not a malfunction — it is love with nowhere to go yet. The intensity of what you feel is a measure of how deeply you are capable of connecting. What are you grieving that you have not yet given yourself permission to fully feel?", tags: ["grief", "loss", "love", "feel", "permission"] },
  { text: "Notice this: healing does not mean the loss stops mattering. It means you learn to carry it differently. Some things are not meant to be gotten over — they are meant to be integrated. What would it mean to carry this with you, honored, instead of trying to put it down?", tags: ["grief", "heal", "carry", "integrate", "loss"] },
  { text: "Dear one, the ones you have loved and lost are not gone. Love does not end — it transforms its form. What you call absence is a different kind of presence. What do you still feel from them that you cannot explain?", tags: ["grief", "kryon", "loss", "love", "presence"] },
  { text: "From our perspective, grief opens the most profound channel between dimensions. Your tears are not weakness. They are a language that the universe understands completely. What is your grief trying to say that words have not yet captured?", tags: ["grief", "wendy", "dimension", "tears", "loss"] },
  { text: "You already know this: you will not always feel this way. Not because the love will diminish — but because you will grow large enough to hold it without being crushed. What small thing still feels okay, even now?", tags: ["grief", "hope", "feel", "hold", "forward"] },

  // PEACE & STILLNESS
  { text: "You already know this: peace is not something that arrives when everything is solved. It is a frequency you choose to inhabit before the solving is done. What would it take for you to choose peace right now, in this exact moment, with this exact situation unresolved?", tags: ["peace", "stillness", "choose", "anchor", "frequency"] },
  { text: "Notice this: the moments when you feel most at peace are not random. They are your natural state breaking through. What conditions were present the last time you felt genuinely at rest inside yourself?", tags: ["peace", "natural", "stillness", "anchor", "conditions"] },
  { text: "Dear one, the calm you seek is not outside this moment. It is inside it — inside you — waiting beneath the noise. You have touched it before. It has not moved. What would help you find your way back to it right now?", tags: ["peace", "kryon", "calm", "beneath", "return"] },
  { text: "From our perspective, when you are in your natural frequency — the one beneath the roles and reactions — you are already in peace. What feels most like your natural frequency? Not the you that the world sees, but the you that watches.", tags: ["peace", "wendy", "natural", "frequency", "witness"] },
  { text: "You already know this: stillness is not empty. It is full. Full of the intelligence that cannot reach you when you are in motion. What have you been too busy to hear?", tags: ["peace", "stillness", "full", "hear", "intelligence"] },

  // NATURE & GROUNDEDNESS
  { text: "You already know this: your body is made of the same intelligence as the trees, the ocean, the stars. When you feel ungrounded, it is because you have forgotten you are not separate from the Earth — you are an expression of it. What in nature helps you feel most like yourself?", tags: ["nature", "ground", "body", "anchor", "earth"] },
  { text: "Notice this: the natural world does not rush its seasons. The oak tree does not apologize for its pace. You are made of this same unhurried intelligence. What would slow down to nature's rhythm feel like for you this week?", tags: ["nature", "pace", "season", "rush", "anchor"] },
  { text: "Dear one, your physical body is the Earth's way of experiencing consciousness. Every breath you take is a conversation between you and this planet. When did you last let that exchange be something you actually felt?", tags: ["nature", "kryon", "body", "earth", "breath"] },

  // ABUNDANCE & RECEIVING
  { text: "You already know this: the universe is not scarce. Scarcity is a frequency, not a fact. What you believe about what is available to you determines what you can receive. What belief about money, love, or opportunity would you be willing to question today?", tags: ["abundance", "receive", "scarcity", "believe", "frequency"] },
  { text: "Notice this: you often give generously and receive reluctantly. But receiving is also a gift — it allows others the joy of giving. What would it feel like to receive with the same openness you give?", tags: ["abundance", "receive", "give", "caretaker", "worthy"] },
  { text: "From our perspective, you have been broadcasting a signal that says 'I am not ready for this yet.' And the universe, respecting your signal, waits. What signal would you like to broadcast instead?", tags: ["abundance", "wendy", "signal", "ready", "broadcast"] },

  // BODY & HEALTH
  { text: "You already know this: your body is always communicating with you. The pain, the tension, the fatigue — these are not betrayals. They are messages. What is your body trying to tell you that you have been too busy or too afraid to hear?", tags: ["body", "health", "listen", "message", "tension"] },
  { text: "Notice this: the way you speak to your body shapes it as much as what you eat or how you move. What would shift if you began to speak to your body as an ally rather than a problem to be managed?", tags: ["body", "health", "speak", "ally", "language"] },
  { text: "Dear one, your body carries the memory of every experience you have ever had. Its wisdom predates your mind's. When your body says no — even quietly — it is worth stopping to ask why. When did your body last clearly say no that you overrode?", tags: ["body", "kryon", "memory", "wisdom", "no"] },

  // THE PRESENT MOMENT
  { text: "You already know this: the past is complete. It cannot be rewritten — only reframed. And the future does not exist yet. The only place you have any power at all is here, in this breath, in this moment. What is actually okay right here, right now?", tags: ["present", "now", "past", "future", "power"] },
  { text: "Notice this: anxiety lives in the future. Guilt lives in the past. Peace lives in the present. You do not have to solve everything — you only have to be here. What would 'just being here' look like for the next ten minutes?", tags: ["present", "anxiety", "peace", "here", "now"] },
  { text: "From our perspective, the present moment is the only point of contact between all dimensions. When you are truly here, you are also everywhere. What brings you most fully into the present moment?", tags: ["present", "wendy", "dimension", "here", "anchor"] },

  // TRUST & SURRENDER
  { text: "You already know this: the tightest grip is not the safest hold. Sometimes surrender is not giving up — it is giving way to something larger than the plan you made. What would you allow to unfold if you loosened your grip just slightly?", tags: ["trust", "surrender", "control", "allow", "unfold"] },
  { text: "Notice this: the things you most tightly control are the things you most deeply fear losing. What would it mean if you discovered that what you fear losing was never actually yours to lose?", tags: ["trust", "control", "fear", "lose", "surrender"] },
  { text: "Dear one, trust is not the belief that things will go as planned. It is the knowing that you will be okay regardless. Have you ever been through something that felt unsurvivable — and survived it? What did that teach you about yourself?", tags: ["trust", "kryon", "okay", "survive", "know"] },
  { text: "From our perspective, the times when your plans collapsed were often the moments when something better became possible. What has fallen apart in your life that, in hindsight, made room for something truer?", tags: ["trust", "wendy", "collapse", "room", "truer"] },
  { text: "You already know this: you have been guided this far. Not by accident. By the larger intelligence that moves through you when you allow it. What does your deepest intuition — the one beneath the noise — say right now?", tags: ["trust", "guide", "intuition", "intelligence", "allow"] },

  // SENSITIVITY & DEPTH
  { text: "You already know this: your sensitivity is not a defect — it is a precision instrument. The world told you it was too much. The world was wrong. What does your sensitivity pick up that others routinely miss?", tags: ["sensitive", "depth", "instrument", "too much", "gift"] },
  { text: "Notice this: the ones who feel the most deeply are also the most capable of the most profound joy. Your range is extraordinary. The lows are part of what makes the highs extraordinary. When did you last feel a high that only someone with your depth could access?", tags: ["sensitive", "depth", "joy", "range", "feel"] },
  { text: "Dear one, you came into this lifetime with a highly calibrated awareness. You feel what others are feeling before they say a word. This is a gift — and it requires a different kind of self-care than most people need. What do you need to do to care for someone as sensitive as you?", tags: ["sensitive", "kryon", "aware", "empath", "care"] },

  // THE INNER CHILD
  { text: "You already know this: somewhere inside you is a child who decided very early on what they needed to be in order to be safe. That child made a brilliant decision. But you are not a child anymore, and you have more choices now. What would you tell that child that no one told them then?", tags: ["inner child", "wound", "safe", "role", "child"] },
  { text: "Notice this: the needs that feel most urgent and most painful now are often the needs that went unmet earliest. Not as blame — as information. What did the younger version of you need most that you can now give to yourself?", tags: ["inner child", "wound", "needs", "give", "self"] },
  { text: "Dear one, the little one inside you who learned to be invisible, or perfect, or endlessly helpful — they just wanted to belong. You belong. You have always belonged. What would it feel like to let them rest?", tags: ["inner child", "kryon", "belong", "wound", "rest", "invisible", "golden child"] },

  // COURAGE & ACTION
  { text: "You already know this: waiting until you feel ready is a beautiful form of procrastination. Readiness does not arrive before the action — it arrives inside it. What is one small step you could take today toward the thing you have been waiting to feel ready for?", tags: ["courage", "action", "ready", "step", "forward"] },
  { text: "Notice this: courage is not the absence of fear. It is the decision that something matters more than the fear does. What matters more to you right now than staying comfortable?", tags: ["courage", "fear", "matters", "decision", "action"] },
  { text: "From our perspective, the timeline in which you act and the timeline in which you wait both exist. The question is which version of yourself you want to be living as. Which choice feels more like the truest you?", tags: ["courage", "wendy", "timeline", "act", "choose"] },

  // GENERATIONAL PATTERNS
  { text: "You already know this: some of what you carry was never yours to begin with. The fear, the scarcity, the need to prove — these have a lineage. You are not just healing yourself. You are changing the frequency for everyone who came before and after. What pattern are you breaking that your parents could not?", tags: ["generational", "wound", "lineage", "heal", "pattern", "family"] },
  { text: "Notice this: the strength in your family did not disappear — it transformed. Whatever your ancestors survived to bring you here is woven into you. What strength do you carry that you have not yet fully claimed?", tags: ["generational", "strength", "ancestor", "family", "claim"] },
  { text: "Dear one, in the quantum field, healing has no single direction. When you heal, you transmit that healing backwards and forwards through your lineage. You are doing work larger than you know. What would you want your great-grandchildren to inherit from the work you are doing right now?", tags: ["generational", "kryon", "quantum", "heal", "lineage", "transmit"] },

  // TRANSITION & CHANGE
  { text: "You already know this: the discomfort you feel in transition is not a signal that something is wrong — it is the sensation of becoming. The caterpillar in the chrysalis cannot see the butterfly. What if the dissolution you feel right now is actually transformation?", tags: ["transition", "change", "becoming", "discomfort", "transform"] },
  { text: "Notice this: every ending in your life has been followed by a beginning that the ending made room for. What is ending right now — and what do you sense might be waiting to begin?", tags: ["transition", "ending", "beginning", "room", "change"] },
  { text: "From our perspective, you are in the middle of a significant vibrational shift. The old self and the new self are overlapping — which can feel disorienting. What belongs to the old version of you that you are ready to put down?", tags: ["transition", "wendy", "shift", "vibrational", "old", "new"] },

  // SELF-COMPASSION
  { text: "You already know this: you would never speak to someone you love the way you speak to yourself. That voice — the critical one — learned its lines from someone else. It is not the truth. What would you say to yourself right now if you spoke with the tenderness you reserve for those you love most?", tags: ["compassion", "self", "critical", "voice", "tender"] },
  { text: "Notice this: the harshest judge in your life lives inside you. And you can choose not to believe everything it says. What is one thing your inner critic says that, if you heard a friend say it about themselves, you would immediately correct?", tags: ["compassion", "critic", "judge", "believe", "self"] },
  { text: "Dear one, you would not demand that a seed become a tree overnight and call it a failure for still being a seedling. You are in process. You are not behind. You are exactly where the becoming requires you to be. Can you give yourself the grace of being in progress?", tags: ["compassion", "kryon", "process", "grace", "seed", "becoming"] },

  // FINAL DEEP ONES
  { text: "You already know this: the question that brought you here today is not a problem to be solved — it is a conversation your soul is ready to have. What is the real question underneath the question you asked?", tags: ["depth", "soul", "question", "real", "beneath"] },
  { text: "Notice this: the fact that you are here, asking, seeking, willing to look inward — that itself is extraordinary. Most people never stop long enough to do what you are doing right now. What does it mean to you that you chose to look?", tags: ["depth", "seeking", "inward", "courage", "choose"] },
  { text: "From our perspective, the love you are looking for is not elsewhere. It has always been the very substance you are made of. You are not searching for love — you are love, searching for itself. When do you feel most like this is true?", tags: ["love", "wendy", "substance", "made of", "searching"] },
  { text: "You already know this: there is no destination at which you will finally be okay. You are already okay. The arrival you are waiting for is happening right now, in the choosing, in the noticing, in the returning to yourself again and again. What does it feel like to arrive here, in this moment, as you are?", tags: ["arrival", "okay", "destination", "now", "return", "wholeness"] },
  { text: "Dear one, you have done nothing wrong. You have done nothing wrong. The shame, the 'should have,' the 'why can't I' — these are not the truth of you. They are the noise. Beneath the noise: you are loved beyond your current ability to comprehend. What would you do, who would you be, if you fully believed that?", tags: ["shame", "kryon", "loved", "wrong", "beneath", "worthy"] },
];

// ─── SMART REFLECTION SELECTOR ───────────────────────────────────────────────
function getReflection(profile: Profile, question: string, used: Set<number>): string {
  const q = question.toLowerCase();

  // Build relevance tags from question + profile
  const tags: string[] = [];
  if (q.includes("purpose") || q.includes("why") || q.includes("meaning")) tags.push("purpose");
  if (q.includes("worth") || q.includes("enough") || q.includes("deserve")) tags.push("worthy");
  if (q.includes("lone") || q.includes("alone") || q.includes("connect")) tags.push("lonely", "connection");
  if (q.includes("pattern") || q.includes("keep doing") || q.includes("repeat")) tags.push("pattern");
  if (q.includes("fear") || q.includes("scared") || q.includes("afraid") || q.includes("anxious")) tags.push("fear");
  if (q.includes("sabotage") || q.includes("mess up") || q.includes("ruin")) tags.push("sabotage");
  if (q.includes("relationship") || q.includes("partner") || q.includes("people")) tags.push("relationship");
  if (q.includes("rest") || q.includes("tired") || q.includes("exhaust")) tags.push("rest");
  if (q.includes("decision") || q.includes("choose") || q.includes("clarity") || q.includes("know what")) tags.push("clarity", "decision");
  if (q.includes("creat") || q.includes("stuck") || q.includes("block")) tags.push("creative");
  if (q.includes("grief") || q.includes("loss") || q.includes("miss")) tags.push("grief");
  if (q.includes("body") || q.includes("health") || q.includes("pain")) tags.push("body");
  if (q.includes("trust") || q.includes("control") || q.includes("let go")) tags.push("trust", "surrender");
  if (q.includes("change") || q.includes("transition") || q.includes("end")) tags.push("transition");
  if (q.includes("family") || q.includes("parent") || q.includes("childhood")) tags.push("generational", "inner child");

  // Add profile-based tags
  if (profile.wound.includes("first")) tags.push("boundaries", "caretaker");
  if (profile.wound.includes("approval")) tags.push("worthy", "approval-seeking");
  if (profile.wound.includes("sabotag")) tags.push("sabotage");
  if (profile.wound.includes("arm's length")) tags.push("lonely", "connection");
  if (profile.wound.includes("overwork")) tags.push("overworking", "worthy");
  if (profile.wound.includes("yes")) tags.push("boundaries");
  if (profile.disconnect.includes("Overwhelm")) tags.push("rest", "overwhelm");
  if (profile.disconnect.includes("Loneliness")) tags.push("lonely");
  if (profile.disconnect.includes("Comparison")) tags.push("worthy");
  if (profile.disconnect.includes("Conflict")) tags.push("relationship");
  if (profile.disconnect.includes("Uncertainty")) tags.push("fear", "trust");
  if (profile.seeking.includes("Clarity")) tags.push("clarity", "decision");
  if (profile.seeking.includes("rest")) tags.push("rest", "permission");
  if (profile.seeking.includes("Confidence")) tags.push("courage", "worthy");
  if (profile.seeking.includes("relationship")) tags.push("relationship");
  if (profile.seeking.includes("purpose")) tags.push("purpose");
  if (profile.seeking.includes("peace")) tags.push("peace", "stillness");

  // Score each reflection
  const scored = REFLECTIONS.map((r, i) => {
    if (used.has(i)) return { i, score: -1 };
    const score = tags.filter(t => r.tags.includes(t)).length;
    return { i, score };
  }).filter(x => x.score >= 0);

  scored.sort((a, b) => b.score - a.score);

  // Pick from top scorers with some variety
  const topScore = scored[0]?.score || 0;
  const topPool = scored.filter(x => x.score >= Math.max(topScore - 1, 1));
  const pick = topPool.length > 0
    ? topPool[Math.floor(Math.random() * Math.min(topPool.length, 5))].i
    : scored[Math.floor(Math.random() * Math.min(scored.length, 10))]?.i || 0;

  return REFLECTIONS[pick].text;
}

function getFirstReflection(profile: Profile): string {
  // Carefully select the opening reflection based on full profile
  const tags: string[] = [];
  if (profile.role.includes("Peacemaker")) tags.push("boundaries", "caretaker", "peacemaker");
  if (profile.role.includes("Achiever")) tags.push("worthy", "overworking");
  if (profile.role.includes("Caretaker")) tags.push("caretaker", "boundaries", "receive");
  if (profile.role.includes("Invisible")) tags.push("invisible", "worthy", "connection");
  if (profile.role.includes("Rebel")) tags.push("courage", "identity", "authentic");
  if (profile.role.includes("Golden")) tags.push("worthy", "sabotage", "golden child");
  if (profile.seeking.includes("purpose")) tags.push("purpose");
  if (profile.seeking.includes("rest")) tags.push("rest", "permission");
  if (profile.seeking.includes("Confidence")) tags.push("courage");
  if (profile.seeking.includes("peace")) tags.push("peace");
  if (profile.seeking.includes("purpose")) tags.push("purpose");

  const scored = REFLECTIONS.map((r, i) => ({
    i, score: tags.filter(t => r.tags.includes(t)).length
  }));
  scored.sort((a, b) => b.score - a.score);
  const topPool = scored.slice(0, 8);
  const pick = topPool[Math.floor(Math.random() * topPool.length)]?.i || 0;
  return REFLECTIONS[pick].text;
}

// ─── INTAKE ───────────────────────────────────────────────────────────────────
const INTAKE: IntakeQuestion[] = [
  { id: "role", q: "In your family growing up, what role did you most often play?", opts: ["The Peacemaker", "The Achiever", "The Caretaker", "The Invisible One", "The Rebel", "The Golden Child"] },
  { id: "disconnect", q: "When you feel most disconnected from yourself, what's usually happening?", opts: ["Overwhelm & too much to do", "Loneliness or feeling unseen", "Comparison & not feeling enough", "Conflict with someone close", "Uncertainty about the future", "Being needed by everyone"] },
  { id: "anchor", q: "When you're most at peace, what's usually present?", opts: ["Stillness & solitude", "Deep connection with someone", "Creative flow", "Being in nature", "Feeling purposeful", "Laughter & lightness"] },
  { id: "wound", q: "What pattern do you find yourself repeating even when you don't want to?", opts: ["Putting others first, losing myself", "Seeking approval before trusting myself", "Self-sabotaging when things go well", "Keeping people at arm's length", "Overworking to feel worthy", "Saying yes when I mean no"] },
  { id: "seeking", q: "What are you most hoping to find within yourself right now?", opts: ["Clarity on a decision", "Permission to rest", "Confidence to move forward", "Understanding of a relationship", "Reconnection with my purpose", "Peace with the past"] },
];

const FREE_LIMIT = 2;

const stars = Array.from({ length: 80 }, (_, i) => ({
  id: i, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, delay: `${Math.random() * 4}s`,
}));

function Starfield() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {stars.map((s) => (
        <div key={s.id} style={{ position: "absolute", top: s.top, left: s.left, width: 2, height: 2, borderRadius: "50%", background: "white", opacity: 0.25, animation: `twinkle 3s ${s.delay} infinite alternate` }} />
      ))}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
        @keyframes twinkle { from{opacity:0.1}to{opacity:0.5} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
        @keyframes dotPulse { 0%,80%,100%{transform:scale(0.6);opacity:0.3}40%{transform:scale(1);opacity:1} }
        @keyframes shimmer { 0%{opacity:0.7}50%{opacity:1}100%{opacity:0.7} }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body,#root{height:100%;width:100%;}
        input::placeholder{color:rgba(63,182,139,0.45);}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:rgba(63,182,139,0.3);border-radius:2px;}
        button:hover{filter:brightness(1.08);}
      `}</style>
    </div>
  );
}

const rootStyle: CSSProperties = {
  minHeight: "100vh", width: "100%",
  background: "radial-gradient(ellipse at 20% 20%, rgba(13,27,42,0.95) 0%, #07111C 70%)",
  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  fontFamily: "'Lora', Georgia, serif", color: C.sand, position: "relative",
};

export default function App() {
  const [screen, setScreen] = useState<"splash" | "intake" | "chat" | "upgrade">("splash");
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState<Record<string, Choice>>({});
  const [pickingSecond, setPickingSecond] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [reflectionsLeft, setReflectionsLeft] = useState(FREE_LIMIT);
  const [isPro] = useState(false);
  const [profile, setProfile] = useState<Profile>({ role: "", disconnect: "", anchor: "", wound: "", seeking: "" });
  const [usedReflections] = useState<Set<number>>(new Set());
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const currentQ = INTAKE[step];
  const sel = choices[currentQ?.id] || { first: "", second: null };

  function selectFirst(opt: string) {
    setChoices((c) => ({ ...c, [currentQ.id]: { first: opt, second: null } }));
    setPickingSecond(false);
  }

  function selectSecond(opt: string) {
    if (opt === sel.first) return;
    setChoices((c) => ({ ...c, [currentQ.id]: { ...c[currentQ.id], second: opt } }));
  }

  function nextStep() {
    if (!sel.first) return;
    if (step < INTAKE.length - 1) { setStep((s) => s + 1); setPickingSecond(false); }
    else {
      const p: Profile = { role: "", disconnect: "", anchor: "", wound: "", seeking: "" };
      INTAKE.forEach((q) => { p[q.id] = choices[q.id]?.first || ""; });
      setProfile(p);
      startChat(p);
    }
  }

  function startChat(p: Profile) {
    setScreen("chat");
    setLoading(true);
    setTimeout(() => {
      const reply = getFirstReflection(p);
      setMessages([{ role: "assistant", content: reply }]);
      setLoading(false);
      setReflectionsLeft((r) => r - 1);
    }, 1800);
  }

  function sendMessage() {
    if (!input.trim() || loading) return;
    if (!isPro && reflectionsLeft <= 0) { setScreen("upgrade"); return; }
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    const q = input.trim();
    setTimeout(() => {
      const reply = getReflection(profile, q, usedReflections);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      if (!isPro) setReflectionsLeft((r) => Math.max(0, r - 1));
      setLoading(false);
    }, 1400 + Math.random() * 800);
  }

  function resetApp() {
    setScreen("splash"); setMessages([]); setStep(0); setChoices({}); setReflectionsLeft(FREE_LIMIT);
    setProfile({ role: "", disconnect: "", anchor: "", wound: "", seeking: "" });
    usedReflections.clear();
  }

  function unlockWithEmail() {
    if (!email.includes("@")) return;
    setEmailSent(true);
    setTimeout(() => { setReflectionsLeft(FREE_LIMIT); setEmailSent(false); setEmail(""); setScreen("chat"); }, 1500);
  }

  const btn = (extra?: CSSProperties): CSSProperties => ({ background: C.green, color: "#07111C", border: "none", padding: "13px 36px", borderRadius: 40, fontSize: 15, fontWeight: 700, fontFamily: "'Cinzel', serif", letterSpacing: "0.06em", cursor: "pointer", transition: "all 0.2s", ...extra });
  const ghost = (extra?: CSSProperties): CSSProperties => ({ background: "transparent", color: C.muted, border: `1px solid ${C.border}`, padding: "11px 24px", borderRadius: 40, fontSize: 14, fontFamily: "'Lora', serif", cursor: "pointer", ...extra });
  const optBtn = (active: boolean, yellow = false): CSSProperties => ({ background: active ? (yellow ? "rgba(246,201,14,0.1)" : "rgba(63,182,139,0.1)") : "rgba(13,27,42,0.8)", border: `1px solid ${active ? (yellow ? C.yellow : C.green) : C.border}`, color: C.sand, padding: "12px 16px", borderRadius: 12, fontSize: 14, fontFamily: "'Lora', serif", textAlign: "left", cursor: "pointer", lineHeight: 1.4, transition: "all 0.2s" });

  // SPLASH
  if (screen === "splash") return (
    <div style={rootStyle}>
      <Starfield />
      <div style={{ zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", animation: "fadeUp 1s ease both", padding: "0 24px", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 8, animation: "shimmer 4s infinite" }}>🌙</div>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 42, fontWeight: 400, letterSpacing: "0.12em", marginBottom: 8 }}>Reflections</h1>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: "0.2em", color: C.green, textTransform: "uppercase", marginBottom: 24 }}>A mirror for the soul</p>
        <p style={{ color: C.muted, maxWidth: 320, lineHeight: 1.8, marginBottom: 40 }}>Not a guru. Not a therapist.<br />A permission slip to access the answers already within.</p>
        <button style={btn()} onClick={() => setScreen("intake")}>Begin</button>
        <p style={{ color: C.muted, fontSize: 13, marginTop: 16 }}>Free · 2 reflections</p>
      </div>
    </div>
  );

  // INTAKE
  if (screen === "intake") {
    const progress = ((step + 1) / INTAKE.length) * 100;
    return (
      <div style={rootStyle}>
        <Starfield />
        <div style={{ zIndex: 1, width: "100%", maxWidth: 580, padding: "40px 24px", animation: "fadeUp 0.5s ease both" }}>
          <div style={{ height: 2, background: "rgba(63,182,139,0.15)", borderRadius: 2, marginBottom: 12, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: C.green, borderRadius: 2, transition: "width 0.4s ease" }} />
          </div>
          <p style={{ color: C.muted, fontSize: 12, marginBottom: 28, letterSpacing: "0.08em" }}>{step + 1} of {INTAKE.length}</p>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, fontWeight: 400, lineHeight: 1.5, marginBottom: 24, letterSpacing: "0.02em" }}>{currentQ.q}</h2>
          {!pickingSecond ? (
            <>
              <p style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>Choose what resonates most</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
                {currentQ.opts.map((opt) => (
                  <button key={opt} onClick={() => selectFirst(opt)} style={optBtn(sel.first === opt)}>
                    {sel.first === opt && <span style={{ color: C.green, marginRight: 8 }}>✦</span>}{opt}
                  </button>
                ))}
              </div>
              {sel.first && (
                <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button onClick={() => setPickingSecond(true)} style={ghost({ fontSize: 13 })}>+ Add second choice</button>
                  <button onClick={nextStep} style={btn()}>{step < INTAKE.length - 1 ? "Continue →" : "Enter →"}</button>
                </div>
              )}
            </>
          ) : (
            <>
              <p style={{ color: C.muted, fontSize: 13, marginBottom: 6 }}>First choice: <span style={{ color: C.green }}>{sel.first}</span></p>
              <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Second is optional — only your first shapes your experience</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
                {currentQ.opts.filter((o) => o !== sel.first).map((opt) => (
                  <button key={opt} onClick={() => selectSecond(opt)} style={optBtn(sel.second === opt, true)}>
                    {sel.second === opt && <span style={{ color: C.yellow, marginRight: 8 }}>◈</span>}{opt}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
                <button onClick={() => setPickingSecond(false)} style={ghost()}>← Back</button>
                <button onClick={nextStep} style={btn()}>{step < INTAKE.length - 1 ? "Continue →" : "Enter →"}</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // CHAT
  if (screen === "chat") return (
    <div style={{ ...rootStyle, justifyContent: "flex-start", height: "100vh", overflow: "hidden" }}>
      <Starfield />
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10, background: "rgba(7,17,28,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🌙</span>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 18, letterSpacing: "0.1em" }}>Reflections</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {!isPro && <span style={{ background: "rgba(63,182,139,0.12)", color: C.green, fontSize: 12, padding: "4px 12px", borderRadius: 20, border: `1px solid rgba(63,182,139,0.25)` }}>{reflectionsLeft} left</span>}
          <button onClick={resetApp} style={ghost({ padding: "6px 14px", fontSize: 12 })}>Reset</button>
        </div>
      </div>

      <div style={{ width: "100%", flex: 1, overflowY: "auto", padding: "90px 24px 130px", zIndex: 1 }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {messages.length === 0 && !loading && (
            <div style={{ textAlign: "center", marginTop: 80 }}>
              <div style={{ fontSize: 40, opacity: 0.4 }}>✦</div>
              <p style={{ color: C.muted, marginTop: 12 }}>Your reflection is being prepared…</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 20 }}>
              {m.role === "assistant" && <div style={{ marginRight: 10, marginTop: 6, fontSize: 18, opacity: 0.6 }}>🌙</div>}
              <div style={{ maxWidth: "78%", padding: "18px 22px", borderRadius: m.role === "user" ? "20px 20px 4px 20px" : "4px 20px 20px 20px", background: m.role === "user" ? "rgba(63,182,139,0.15)" : C.card, border: m.role === "user" ? "1px solid rgba(63,182,139,0.3)" : `1px solid ${C.border}`, color: C.sand, fontSize: 16, lineHeight: 1.9, fontFamily: "'Lora', Georgia, serif" }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ fontSize: 18, opacity: 0.6 }}>🌙</div>
              <div style={{ display: "flex", gap: 6, padding: "14px 18px", background: C.card, border: `1px solid ${C.border}`, borderRadius: "4px 20px 20px 20px" }}>
                {[0, 0.2, 0.4].map((d, i) => <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, display: "inline-block", animation: `dotPulse 1.2s ${d}s infinite ease-in-out` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10, background: "rgba(7,17,28,0.95)", backdropFilter: "blur(12px)", borderTop: `1px solid ${C.border}`, padding: "16px 24px", width: "100%" }}>
        {!isPro && reflectionsLeft <= 0 ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: C.yellow, marginBottom: 12, fontSize: 14 }}>You've used your free reflections.</p>
            <button onClick={() => setScreen("upgrade")} style={btn()}>Unlock More →</button>
          </div>
        ) : (
          <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", gap: 10 }}>
            <input style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, color: C.sand, padding: "14px 20px", borderRadius: 40, fontSize: 15, fontFamily: "'Lora', serif", outline: "none" }}
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask what you came here to remember…" disabled={loading} />
            <button onClick={sendMessage} disabled={!input.trim() || loading}
              style={{ background: C.green, color: "#07111C", border: "none", width: 50, height: 50, borderRadius: "50%", fontSize: 20, fontWeight: 700, cursor: "pointer", opacity: !input.trim() || loading ? 0.4 : 1, flexShrink: 0, transition: "opacity 0.2s" }}>↑</button>
          </div>
        )}
      </div>
    </div>
  );

  // UPGRADE
  return (
    <div style={rootStyle}>
      <Starfield />
      <div style={{ zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 440, padding: "40px 24px", animation: "fadeUp 0.5s ease both" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✦</div>
        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 32, fontWeight: 400, letterSpacing: "0.1em", marginBottom: 12 }}>Go Deeper</h2>
        <p style={{ color: C.muted, maxWidth: 300, textAlign: "center", lineHeight: 1.7, marginBottom: 32 }}>You've used your free reflections. The conversation doesn't have to end here.</p>
        <div style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>Free — Unlock with email</p>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>Get more reflections each day</p>
          {!emailSent ? (
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, color: C.sand, padding: "10px 14px", borderRadius: 40, fontSize: 14, fontFamily: "'Lora', serif", outline: "none" }}
                placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && unlockWithEmail()} />
              <button onClick={unlockWithEmail} style={btn({ padding: "10px 20px", fontSize: 14 })}>Unlock</button>
            </div>
          ) : <p style={{ color: C.green, fontSize: 14 }}>✓ Unlocked — returning you…</p>}
        </div>
        <div style={{ width: "100%", background: C.card, border: "1px solid rgba(246,201,14,0.35)", borderRadius: 16, padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <p style={{ fontWeight: 600 }}>Pro — $9/mo</p>
            <span style={{ background: "rgba(246,201,14,0.15)", color: C.yellow, fontSize: 11, padding: "3px 8px", borderRadius: 20, letterSpacing: "0.06em" }}>COMING SOON</span>
          </div>
          <ul style={{ color: C.muted, fontSize: 13, lineHeight: 2.2, listStyle: "none" }}>
            <li>✦ Unlimited reflections</li>
            <li>✦ Return to past sessions</li>
            <li>✦ Retake your intake anytime</li>
            <li>✦ Deeper reflection modes</li>
          </ul>
          <button disabled style={btn({ marginTop: 12, opacity: 0.5, cursor: "default" })}>Join Waitlist</button>
        </div>
        <button onClick={() => setScreen("chat")} style={ghost({ marginTop: 20 })}>← Back to Reflections</button>
      </div>
    </div>
  );
}